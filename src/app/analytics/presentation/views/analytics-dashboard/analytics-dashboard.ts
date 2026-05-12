import { Component, inject, signal, computed } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AnalyticsStore } from '../../../application/analytics.store';

export type Period = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

interface ChartPoint { day: string; count: number; }

const DAY_COUNTS   = [0,0,0,0,0,1,2,4,6,5,3,4,7,5,4,3,5,6,4,3,2,1,1,0];
const WEEK_COUNTS  = [2, 4, 1, 3, 5, 3, 1];
const MONTH_COUNTS = [8, 11, 7, 14, 5];
const YEAR_COUNTS  = [18, 22, 15, 30, 28, 25, 20, 18, 24, 30, 26, 22];

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './analytics-dashboard.html',
})
export class AnalyticsDashboard {
  private store     = inject(AnalyticsStore);
  private translate = inject(TranslateService);

  readonly metrics = this.store.metrics;

  readonly periods: Period[] = ['DAY', 'WEEK', 'MONTH', 'YEAR'];
  selectedPeriod = signal<Period>('WEEK');

  readonly computedChartData = computed<ChartPoint[]>(() => {
    const period = this.selectedPeriod();
    const days   = (this.translate.instant('analytics.days-abbr') as string).split(',');
    const months = (this.translate.instant('analytics.months-abbr') as string).split(',');
    const now    = new Date();
    const curMonth = months[now.getMonth()] ?? months[0];

    if (period === 'DAY') {
      return DAY_COUNTS.map((count, i) => ({ day: `${String(i).padStart(2, '0')}h`, count }));
    }
    if (period === 'WEEK') {
      return WEEK_COUNTS.map((count, i) => ({ day: days[i] ?? '', count }));
    }
    if (period === 'MONTH') {
      return MONTH_COUNTS.map((count, i) => {
        const startDay = i * 7 + 1;
        return { day: `${startDay} ${curMonth}`, count };
      });
    }
    return YEAR_COUNTS.map((count, i) => ({
      day: `${months[i] ?? ''} '${String(now.getFullYear()).slice(-2)}`,
      count,
    }));
  });

  readonly maxChartVal = computed(() =>
    Math.max(...this.computedChartData().map(d => d.count), 1)
  );

  readonly chartTitle = computed(() =>
    'analytics.chart-title-' + this.selectedPeriod().toLowerCase()
  );

  periodKey(p: Period): string {
    return 'analytics.period-' + p.toLowerCase();
  }

  barHeightPct(count: number): string {
    const max = this.maxChartVal();
    return max === 0 ? '0%' : `${Math.round((count / max) * 100)}%`;
  }
}
