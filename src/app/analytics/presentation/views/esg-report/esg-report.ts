import { Component, inject, computed } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AnalyticsStore } from '../../../application/analytics.store';

@Component({
  selector: 'app-esg-report',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './esg-report.html',
})
export class EsgReport {
  private store = inject(AnalyticsStore);

  readonly isPlatinum = this.store.isPlatinum;
  readonly segment    = this.store.segment;
  readonly esg        = this.store.esg;

  readonly isMining   = computed(() => this.segment() === 'MINING');
  readonly isJewelry  = computed(() => this.segment() === 'JEWELRY');

  exportPdf(): void {
    this.store.exportPdfReport();
  }
}
