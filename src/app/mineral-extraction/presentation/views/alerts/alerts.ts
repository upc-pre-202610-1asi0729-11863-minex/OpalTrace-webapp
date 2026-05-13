import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MineralStore, AnomalyAlert } from '../../../application/mineral.store';

type AnomalyCategory = 'WeightDiscrepancy' | 'DelayedTransport' | 'StateSkipped' | 'Otro';

/**
 * Alerts view.
 * Displays all anomaly alerts from the MineralStore with colour-coded severity.
 * Also contains a report-anomaly form that calls store.reportAnomaly().
 */
@Component({
  selector: 'app-alerts',
  imports: [FormsModule, DatePipe, TranslatePipe],
  templateUrl: './alerts.html',
  styleUrl: './alerts.css',
})
export class Alerts {
  private store     = inject(MineralStore);
  private translate = inject(TranslateService);

  readonly alerts = this.store.alerts;

  // ── Report form fields ─────────────────────────────────────────
  readonly categories: Array<{ value: AnomalyCategory; labelKey: string }> = [
    { value: 'WeightDiscrepancy', labelKey: 'alerts.type-weight'  },
    { value: 'DelayedTransport',  labelKey: 'alerts.type-delayed' },
    { value: 'StateSkipped',      labelKey: 'alerts.type-skipped' },
    { value: 'Otro',              labelKey: 'alerts.type-other'   },
  ];

  reportBatchId    = '';
  reportCategory: AnomalyCategory = 'WeightDiscrepancy';
  reportDescription = '';
  reportPhoto: File | null = null;

  // ── UI state ───────────────────────────────────────────────────
  reportSuccess = signal(false);
  reportError   = signal('');

  // ── Helpers ────────────────────────────────────────────────────

  /** CSS box class based on alert type. */
  alertBoxClass(alert: AnomalyAlert): string {
    return alert.type === 'WeightDiscrepancy' ? 'alert-box alert-danger' : 'alert-box alert-warning';
  }

  /** Badge class for the type pill. */
  typeBadgeClass(alert: AnomalyAlert): string {
    return alert.type === 'WeightDiscrepancy' ? 'badge badge-red' : 'badge badge-amber';
  }

  typeLabel(alert: AnomalyAlert): string {
    const keyMap: Record<string, string> = {
      WeightDiscrepancy: 'alerts.type-weight',
      DelayedTransport:  'alerts.type-delayed',
      StateSkipped:      'alerts.type-skipped',
    };
    return this.translate.instant(keyMap[alert.type] ?? alert.type);
  }

  resolveAnomaly(alertId: string): void {
    this.store.resolveAlert(alertId);
  }

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.reportPhoto = input.files?.[0] ?? null;
  }

  onReportSubmit(): void {
    this.reportSuccess.set(false);
    this.reportError.set('');

    if (!this.reportBatchId.trim()) {
      this.reportError.set(this.translate.instant('alerts.err-batch'));
      return;
    }
    if (!this.reportDescription.trim()) {
      this.reportError.set(this.translate.instant('alerts.err-desc'));
      return;
    }

    this.store.reportAnomaly(
      this.reportBatchId.trim(),
      this.reportCategory,
      this.reportDescription.trim(),
    );

    this.reportSuccess.set(true);
    this.reportBatchId    = '';
    this.reportDescription = '';
    this.reportPhoto       = null;
  }
}
