import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { RefineryStore, SubLot } from '../../../application/refinery.store';
import { IamStore } from '../../../../iam/application/iam.store';

interface SplitResult {
  success: boolean;
  sublots?: SubLot[];
  error?: string;
}

/**
 * Split Batch view.
 * Route: /refinery/split/:batchId  |  /refinery/split  |  /refinery/sublots
 * Allows dividing a received batch into N sublots.
 * Validates that the sum of sublot weights equals the parent batch weight.
 * Restricted to PLATINUM plan.
 */
@Component({
  selector: 'app-split-batch',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './split-batch.html',
})
export class SplitBatch {
  private store    = inject(RefineryStore);
  private iamStore = inject(IamStore);
  private route    = inject(ActivatedRoute);

  readonly isPlatinum = this.iamStore.isPlatinum;
  readonly sublots    = computed(() => this.store.sublots());

  /** Pre-selected batch from route param, if provided */
  selectedBatchId: string;

  /** Dynamic sublot weight inputs (start with 2 rows) */
  sublotWeights: number[] = [0, 0];

  result = signal<SplitResult | null>(null);

  constructor() {
    this.selectedBatchId = this.route.snapshot.paramMap.get('batchId') ?? '';
    if (!this.selectedBatchId && this.store.batches().length > 0) {
      this.selectedBatchId = this.store.batches()[0].batchId;
    }
  }

  /** Received batches available for splitting */
  readonly availableBatches = computed(() =>
    this.store.batches().filter(b => b.status !== 'Completado')
  );

  readonly selectedBatch = computed(() =>
    this.store.batches().find(b => b.batchId === this.selectedBatchId) ?? null
  );

  readonly sublotSum = computed(() =>
    this.sublotWeights.reduce((s, w) => s + (w || 0), 0)
  );

  readonly sumMatchesParent = computed(() => {
    const parent = this.selectedBatch();
    if (!parent) return false;
    return Math.abs(this.sublotSum() - parent.weightKg) <= 0.01;
  });

  readonly sumDiff = computed(() => {
    const parent = this.selectedBatch();
    if (!parent) return 0;
    return Math.abs(this.sublotSum() - parent.weightKg);
  });

  addSublot(): void {
    this.sublotWeights = [...this.sublotWeights, 0];
  }

  removeSublot(index: number): void {
    if (this.sublotWeights.length <= 2) return;
    this.sublotWeights = this.sublotWeights.filter((_, i) => i !== index);
  }

  updateWeight(index: number, value: number): void {
    this.sublotWeights = this.sublotWeights.map((w, i) => i === index ? (value || 0) : w);
  }

  onConfirm(): void {
    if (!this.selectedBatchId) {
      this.result.set({ success: false, error: 'Selecciona un lote padre.' });
      return;
    }

    const invalidWeights = this.sublotWeights.filter(w => w <= 0);
    if (invalidWeights.length > 0) {
      this.result.set({ success: false, error: 'Todos los sublotes deben tener un peso mayor a 0.' });
      return;
    }

    this.store.splitBatch(this.selectedBatchId, this.sublotWeights).then(outcome => {
      if ('error' in outcome) {
        this.result.set({ success: false, error: outcome.error });
      } else {
        this.result.set({ success: true, sublots: outcome.sublots });
      }
    });
  }

  onReset(): void {
    this.result.set(null);
    this.sublotWeights = [0, 0];
  }

  sublotLabel(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C...
  }
}
