import { computed, Injectable, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { IamStore } from '../../iam/application/iam.store';
import { PlanTier } from '../../shared/infrastructure/auth.mock';
import { SubscriptionsApi } from '../infrastructure/subscriptions-api';
import { Subscription, SubscriptionPlan } from '../domain/model/subscription.entity';
import { BillingRecord } from '../domain/model/billing-record.entity';

@Injectable({ providedIn: 'root' })
export class SubscriptionsStore {
  private readonly api       = inject(SubscriptionsApi);
  private readonly iamStore  = inject(IamStore);
  private readonly snackBar  = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  readonly subscriptionSignal   = signal<Subscription | null>(null);
  readonly billingHistorySignal = signal<BillingRecord[]>([]);
  readonly upgradeLoading       = signal(false);

  readonly currentPlan = computed(() => this.subscriptionSignal()?.plan ?? null);
  readonly isActive    = computed(() => this.subscriptionSignal()?.status === 'ACTIVE');

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
    const userId = this.iamStore.currentUser()?.id;
    if (!userId) return;

    this.api.getSubscriptionByUser(userId).pipe(retry(2)).subscribe({
      next: subscription => {
        if (subscription) this.subscriptionSignal.set(subscription);
      },
      error: () => {},
    });

    this.api.getBillingRecordsByUser(userId).pipe(retry(2)).subscribe({
      next: records => this.billingHistorySignal.set(records),
      error: () => {},
    });
  }

  upgradePlan(newPlan: PlanTier, paymentMethodToken = 'tok_visa'): void {
    const user = this.iamStore.currentUser();
    if (!user) return;

    const current = this.subscriptionSignal();
    const price = this.tierPrice(newPlan);
    this.upgradeLoading.set(true);

    if (current?.id) {
      this.api.upgradeSubscription(current.id, user.id, newPlan, paymentMethodToken).subscribe({
        next: updated => {
          this.subscriptionSignal.set(updated);
          this.iamStore.upgradePlan(newPlan);
          this.upgradeLoading.set(false);
          this.showSnack('subscription.upgrade-success');
        },
        error: (err: HttpErrorResponse) => {
          this.upgradeLoading.set(false);
          this.handlePaymentError(err);
        },
      });
    } else {
      this.api.activateSubscription(user.id, newPlan, paymentMethodToken, price).subscribe({
        next: created => {
          this.subscriptionSignal.set(created);
          this.iamStore.upgradePlan(newPlan);
          this.upgradeLoading.set(false);
          this.showSnack('subscription.upgrade-success');
        },
        error: (err: HttpErrorResponse) => {
          this.upgradeLoading.set(false);
          this.handlePaymentError(err);
        },
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

  private handlePaymentError(err: HttpErrorResponse): void {
    if (err.status === 422) {
      const code: string = err.error?.code ?? '';
      if (code === 'PLAN_TIER_INSUFFICIENT') {
        this.showSnack('subscription.plan-limit-exceeded');
        return;
      }
      this.showSnack('subscription.payment-failed');
      return;
    }
    if (err.status === 402) {
      this.showSnack('subscription.payment-failed');
      return;
    }
    this.showSnack('subscription.payment-failed');
  }

  private showSnack(key: string): void {
    const msg    = this.translate.instant(key);
    const action = this.translate.instant('common.close');
    this.snackBar.open(msg, action, { duration: 5000, panelClass: ['ot-snack'] });
  }

  private tierPrice(tier: PlanTier): number {
    if (tier === 'PLATINUM') return 149;
    if (tier === 'GOLD') return 79;
    return 15;
  }
}
