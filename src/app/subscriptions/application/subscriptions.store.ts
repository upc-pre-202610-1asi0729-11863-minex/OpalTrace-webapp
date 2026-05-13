import { computed, Injectable, inject, signal } from '@angular/core';
import { retry } from 'rxjs/operators';
import { IamStore } from '../../iam/application/iam.store';
import { PlanTier } from '../../shared/infrastructure/auth.mock';
import { SubscriptionsApi } from '../infrastructure/subscriptions-api';
import { Subscription, SubscriptionPlan } from '../domain/model/subscription.entity';
import { BillingRecord } from '../domain/model/billing-record.entity';

@Injectable({ providedIn: 'root' })
export class SubscriptionsStore {
  private readonly api      = inject(SubscriptionsApi);
  private readonly iamStore = inject(IamStore);

  readonly subscriptionSignal  = signal<Subscription | null>(null);
  readonly billingHistorySignal = signal<BillingRecord[]>([]);

  // Computed signals exposed to the presentation layer
  readonly currentPlan = computed(() => this.subscriptionSignal()?.plan ?? null);
  readonly isActive    = computed(() => this.subscriptionSignal()?.status === 'ACTIVE');

  // Aliases kept for backward-compatibility with existing views
  readonly activePlan = computed(() => this.iamStore.currentPlan());
  readonly segment    = computed(() => this.iamStore.currentSegment());

  readonly billingHistory = computed(() => {
    const userId = this.iamStore.currentUser()?.id;
    const all    = this.billingHistorySignal();
    if (userId == null) return all;
    const filtered = all.filter(r => r.userId === userId);
    return filtered.length > 0 ? filtered : [];
  });

  constructor() {
    this.loadSubscription();
  }

  private loadSubscription(): void {
    this.api.getSubscriptions().pipe(retry(2)).subscribe({
      next: subscriptions => {
        if (subscriptions.length > 0) {
          this.subscriptionSignal.set(subscriptions[0]);
        }
      },
      error: () => {
        // Silently ignore — store stays with null subscription (mock data drives the UI)
      },
    });

    this.api.getBillingRecords().pipe(retry(2)).subscribe({
      next: records => this.billingHistorySignal.set(records),
      error: () => {
        // Silently ignore — billing history stays empty on failure
      },
    });
  }

  upgradePlan(newPlan: PlanTier): void {
    this.iamStore.upgradePlan(newPlan);

    const planLabel = newPlan === 'PLATINUM' ? 'Platinum' : newPlan === 'GOLD' ? 'Gold' : 'Silver';
    const price     = newPlan === 'PLATINUM' ? 149 : newPlan === 'GOLD' ? 79 : 15;
    const today     = new Date().toLocaleDateString('es-PE');

    const newRecord = new BillingRecord({
      id: Date.now(),
      userId: this.iamStore.currentUser()?.id ?? 0,
      date: today,
      plan: planLabel,
      amount: price,
      status: 'COMPLETED',
    });

    this.api.createBillingRecord(newRecord).pipe(retry(2)).subscribe({
      next: created => {
        this.billingHistorySignal.update(h => [created, ...h]);
      },
      error: () => {
        this.billingHistorySignal.update(h => [newRecord, ...h]);
      },
    });

    const current = this.subscriptionSignal();
    if (current) {
      const renewalDate = new Date();
      renewalDate.setMonth(renewalDate.getMonth() + 1);

      const updated = new Subscription({
        id: current.id,
        userId: current.userId,
        plan: newPlan as SubscriptionPlan,
        status: 'ACTIVE',
        renewalDate: renewalDate.toISOString(),
        price,
      });

      this.api.updateSubscription(updated).pipe(retry(2)).subscribe({
        next: s => this.subscriptionSignal.set(s),
        error: () => this.subscriptionSignal.set(updated),
      });
    }
  }

  cancelPlan(): { cancelDate: string; readOnlyDays: number } {
    const cancelDate = new Date();
    cancelDate.setMonth(cancelDate.getMonth() + 1);
    const formattedDate = cancelDate.toLocaleDateString('es-PE');

    const current = this.subscriptionSignal();
    if (current) {
      const cancelled = new Subscription({
        id: current.id,
        userId: current.userId,
        plan: current.plan,
        status: 'CANCELLED',
        renewalDate: current.renewalDate,
        price: current.price,
      });

      this.api.updateSubscription(cancelled).pipe(retry(2)).subscribe({
        next: s => this.subscriptionSignal.set(s),
        error: () => this.subscriptionSignal.set(cancelled),
      });
    }

    return { cancelDate: formattedDate, readOnlyDays: 30 };
  }
}

