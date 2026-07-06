import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RefineryStore, ShrinkageRecord, WEIGHT_TARGETS } from '../../../application/refinery.store';
import { IamStore } from '../../../../iam/application/iam.store';

interface ShrinkageResult {
  success: boolean;
  error?: string;
}

/**
 * Shrinkage (Merma) view.
 * Route: /refinery/shrinkage
 * Records weight loss percentage for a batch with an efficiency indicator.
 * Restricted to PLATINUM plan.
 */
@Component({
  selector: 'app-shrinkage',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './shrinkage.html',
})
export class Shrinkage {
  private store     = inject(RefineryStore);
  private iamStore  = inject(IamStore);
  private translate = inject(TranslateService);

  readonly isPlatinum = this.iamStore.isPlatinum;

  /** Form fields */
  selectedBatchId = '';
  percentage: number | null = null;
  shrinkageType: ShrinkageRecord['type'] = 'Evaporación';

  readonly shrinkageTypes: ShrinkageRecord['type'][] = [
    'Evaporación',
    'Residuo',
    'Contaminación',
  ];

  result    = signal<ShrinkageResult | null>(null);
  submitted = signal(false);

  constructor() {
    if (this.store.batches().length > 0) {
      this.selectedBatchId = this.store.batches()[0].batchId;
    }
  }

  readonly availableBatches = computed(() => this.store.batches());

  readonly selectedBatch = computed(() =>
    this.store.batches().find(b => b.batchId === this.selectedBatchId) ?? null
  );

  /** Target percentage for the selected batch's mineral */
  readonly targetPercent = computed((): number | null =>
    this.store.getTargetForBatch(this.selectedBatchId)
  );

  /** True if the entered percentage is within the efficiency target */
  readonly isWithinTarget = computed((): boolean => {
    if (this.percentage == null || this.percentage < 0) return true;
    return this.store.isWithinTarget(this.selectedBatchId, this.percentage);
  });

  /** Efficiency indicator label */
  readonly efficiencyLabel = computed((): string => {
    if (this.percentage == null || this.percentage < 0) return '';
    const target = this.targetPercent();
    if (target == null) return '';
    return this.isWithinTarget()
      ? this.translate.instant('refinery.efficiency-within', { target })
      : this.translate.instant('refinery.efficiency-exceeds', { target });
  });

  /** CSS class for the efficiency indicator */
  readonly efficiencyClass = computed((): string => {
    if (this.percentage == null) return '';
    return this.isWithinTarget() ? 'efficiency-ok' : 'efficiency-exceeded';
  });

  /** Existing shrinkage records for the selected batch */
  readonly batchShrinkageHistory = computed(() =>
    this.store.getShrinkageForBatch(this.selectedBatchId)
  );

  readonly allTargets = Object.entries(WEIGHT_TARGETS) as [string, number][];

  checkWithinTarget(batchId: string, percentage: number): boolean {
    return this.store.isWithinTarget(batchId, percentage);
  }

  onSubmit(): void {
    if (!this.selectedBatchId) {
      this.result.set({ success: false, error: this.translate.instant('refinery.err-select-lot') });
      return;
    }
    if (this.percentage == null || this.percentage < 0 || this.percentage > 100) {
      this.result.set({ success: false, error: this.translate.instant('refinery.err-shrinkage-range') });
      return;
    }

    this.store.registerShrinkage(
      this.selectedBatchId,
      this.percentage,
      this.shrinkageType
    ).then(outcome => {
      if ('errorKey' in outcome) {
        this.result.set({ success: false, error: this.translate.instant(outcome.errorKey, outcome.errorParams) });
      } else {
        this.result.set({ success: true });
        this.submitted.set(true);
      }
    });
  }

  onReset(): void {
    this.percentage = null;
    this.result.set(null);
    this.submitted.set(false);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('es-PE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }
}
