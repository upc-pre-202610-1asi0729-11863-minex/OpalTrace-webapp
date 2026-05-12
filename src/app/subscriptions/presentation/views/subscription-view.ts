import { Component, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SubscriptionsStore } from '../../application/subscriptions.store';
import { PlanTier } from '../../../shared/infrastructure/auth.mock';

interface PlanCard {
  id: PlanTier;
  nameKey: string;
  price: number;
  featureKeys: string[];
  locked?: boolean;
  lockedMsgKey?: string;
}

@Component({
  selector: 'app-subscription-view',
  imports: [TranslatePipe],
  templateUrl: './subscription-view.html',
  styleUrl: './subscription-view.css',
})
export class SubscriptionView {
  store = inject(SubscriptionsStore);

  toastMsg    = signal<string | null>(null);
  cancelModal = signal(false);
  upgradeModal   = signal<PlanTier | null>(null);
  downgradeModal = signal<PlanTier | null>(null);

  readonly planCards = computed<PlanCard[]>(() => {
    const seg        = this.store.segment();
    const isConsumer = seg === 'CONSUMER';

    const silverCard: PlanCard = {
      id: 'SILVER',
      nameKey: 'subscription.plan-silver',
      price: 15,
      featureKeys: ['subscription.plan-silver-f1','subscription.plan-silver-f2','subscription.plan-silver-f3'],
      locked:       !isConsumer,
      lockedMsgKey: !isConsumer ? 'subscription.locked-companies' : undefined,
    };

    const goldCard: PlanCard = {
      id: 'GOLD',
      nameKey: isConsumer ? 'subscription.plan-gold'
        : seg === 'MINING' ? 'subscription.plan-gold-mining' : 'subscription.plan-gold-jewelry',
      price: 79,
      featureKeys: seg === 'MINING'
        ? ['subscription.plan-gold-mining-f1','subscription.plan-gold-mining-f2','subscription.plan-gold-mining-f3','subscription.plan-gold-mining-f4']
        : seg === 'JEWELRY'
        ? ['subscription.plan-gold-jewelry-f1','subscription.plan-gold-jewelry-f2','subscription.plan-gold-jewelry-f3','subscription.plan-gold-jewelry-f4']
        : ['subscription.plan-gold-consumer-f1','subscription.plan-gold-consumer-f2'],
      locked:       isConsumer,
      lockedMsgKey: isConsumer ? 'subscription.locked-consumers' : undefined,
    };

    const platinumCard: PlanCard = {
      id: 'PLATINUM',
      nameKey: isConsumer ? 'subscription.plan-platinum'
        : seg === 'MINING' ? 'subscription.plan-platinum-mining' : 'subscription.plan-platinum-jewelry',
      price: 149,
      featureKeys: seg === 'MINING'
        ? ['subscription.plan-plat-mining-f1','subscription.plan-plat-mining-f2','subscription.plan-plat-mining-f3','subscription.plan-plat-mining-f4']
        : seg === 'JEWELRY'
        ? ['subscription.plan-plat-jewelry-f1','subscription.plan-plat-jewelry-f2','subscription.plan-plat-jewelry-f3']
        : ['subscription.plan-plat-consumer-f1','subscription.plan-plat-consumer-f2'],
      locked:       isConsumer,
      lockedMsgKey: isConsumer ? 'subscription.locked-consumers' : undefined,
    };

    return [silverCard, goldCard, platinumCard];
  });

  showToast(msg: string) {
    this.toastMsg.set(msg);
    setTimeout(() => this.toastMsg.set(null), 3500);
  }

  openUpgrade(plan: PlanTier)   { this.upgradeModal.set(plan); }
  openDowngrade(plan: PlanTier) { this.downgradeModal.set(plan); }
  closeModals() { this.upgradeModal.set(null); this.downgradeModal.set(null); this.cancelModal.set(false); }

  confirmUpgrade() {
    const plan = this.upgradeModal();
    if (!plan) return;
    this.store.upgradePlan(plan);
    this.closeModals();
    this.showToast(`✓ ${plan} — nuevas funcionalidades habilitadas`);
  }

  confirmDowngrade() {
    this.closeModals();
    this.showToast('Downgrade programado para fin del ciclo actual');
  }

  confirmCancel() {
    const result = this.store.cancelPlan();
    this.closeModals();
    this.showToast(`Suscripción cancelada — acceso hasta ${result.cancelDate}`);
  }

  isCurrent(planId: PlanTier) { return this.store.activePlan() === planId; }
  isConsumer()                { return this.store.segment() === 'CONSUMER'; }
}
