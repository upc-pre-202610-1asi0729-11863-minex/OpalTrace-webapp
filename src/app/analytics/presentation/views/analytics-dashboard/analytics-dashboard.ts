import { Component, inject, signal, computed } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AnalyticsStore } from '../../../application/analytics.store';

export type Period = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

interface ChartPoint { day: string; count: number; }

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

  /** Certification chart bucketed from the user's real certification dates. */
  readonly computedChartData = computed<ChartPoint[]>(() => {
    const period = this.selectedPeriod();
    const days   = (this.translate.instant('analytics.days-abbr') as string).split(',');
    const months = (this.translate.instant('analytics.months-abbr') as string).split(',');
    const now    = new Date();
    const dates  = this.store.certifiedDates()
      .map(d => new Date(d))
      .filter(d => !isNaN(d.getTime()));

    if (period === 'DAY') {
      const counts = new Array(24).fill(0);
      dates.filter(d => this.sameDay(d, now)).forEach(d => counts[d.getHours()]++);
      return counts.map((count, i) => ({ day: `${String(i).padStart(2, '0')}h`, count }));
    }
    if (period === 'WEEK') {
      const counts = new Array(7).fill(0);
      dates.filter(d => this.sameWeek(d, now)).forEach(d => counts[(d.getDay() + 6) % 7]++);
      return counts.map((count, i) => ({ day: days[i] ?? '', count }));
    }
    if (period === 'MONTH') {
      const counts = new Array(5).fill(0);
      dates.filter(d => d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth())
        .forEach(d => counts[Math.min(4, Math.floor((d.getDate() - 1) / 7))]++);
      return counts.map((count, i) => ({ day: `${i * 7 + 1} ${months[now.getMonth()] ?? ''}`, count }));
    }
    const counts = new Array(12).fill(0);
    dates.filter(d => d.getFullYear() === now.getFullYear()).forEach(d => counts[d.getMonth()]++);
    return counts.map((count, i) => ({
      day: `${months[i] ?? ''} '${String(now.getFullYear()).slice(-2)}`,
      count,
    }));
  });

  private sameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  private sameWeek(a: Date, b: Date): boolean {
    const startOfWeek = new Date(b);
    const day = (b.getDay() + 6) % 7;
    startOfWeek.setDate(b.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    return a >= startOfWeek && a < endOfWeek;
  }

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
