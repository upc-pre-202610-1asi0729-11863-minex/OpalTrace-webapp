import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { RefineryStore, WeightDiscrepancyAlert } from '../../../application/refinery.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { MineralStore } from '../../../../mineral-extraction/application/mineral.store';

interface ReceiveResult {
  success: boolean;
  error?: string;
  alert?: WeightDiscrepancyAlert;
}

/**
 * Receive Batch view.
 * Route: /refinery/receive
 * Allows refinery operators to record batch reception and weight verification.
 * Restricted to PLATINUM plan.
 */
@Component({
  selector: 'app-receive-batch',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './receive-batch.html',
})
export class ReceiveBatch {
  private store    = inject(RefineryStore);
  private iamStore = inject(IamStore);
  private mineralStore = inject(MineralStore);

  readonly isPlatinum    = this.iamStore.isPlatinum;
  readonly refineryBatches = computed(() => this.store.batches());

  /** Form fields */
  batchId          = '';
  receivedWeightKg: number | null = null;
  location         = 'Refinería Sur – Arequipa';

  result   = signal<ReceiveResult | null>(null);
  submitted = signal(false);

  /** Batches eligible for reception (in transit, not yet received) */
  readonly eligibleBatches = computed(() => {
    const received = this.store.batches().map(b => b.batchId);
    return this.mineralStore.batches().filter(
      b => b.status === 'En Tránsito' && !received.includes(b.batchId)
    );
  });

  readonly selectedSource = computed(() =>
    this.mineralStore.batches().find(b => b.batchId === this.batchId) ?? null
  );

  onSubmit(): void {
    const id = this.batchId.trim();
    if (!id) {
      this.result.set({ success: false, error: 'Selecciona o ingresa un ID de lote.' });
      return;
    }
    if (!this.receivedWeightKg || this.receivedWeightKg <= 0) {
      this.result.set({ success: false, error: 'El peso recibido debe ser un número positivo.' });
      return;
    }

    this.store.receiveBatch(id, this.receivedWeightKg, this.location).then(outcome => {
      if ('error' in outcome) {
        this.result.set({ success: false, error: outcome.error, alert: outcome.alert });
      } else {
        this.result.set({ success: true });
        this.submitted.set(true);
      }
    });
  }

  onReset(): void {
    this.batchId = '';
    this.receivedWeightKg = null;
    this.result.set(null);
    this.submitted.set(false);
  }
}
