import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { IamStore } from '../../iam/application/iam.store';
import { JewelryStore } from '../../jewelry-inventory/application/jewelry.store';
import { MineralStore } from '../../mineral-extraction/application/mineral.store';
import { AnalyticsMetric } from '../domain/model/analytics-metric.entity';
import { environment } from '../../../environments/environment';

export { AnalyticsMetric };

export interface AnalyticsMetrics {
  totalBatches: number;
  inTransit: number;
  activeAnomalies: number;
  certified: number;
  avgTimePerStage: string;
  avgShrinkage: string;
  certRate: string;
  totalCycleTime: string;
}

export interface ShrinkageDataPoint {
  stage: string;
  inputKg: number;
  outputKg: number;
  shrinkagePct: number;
}

export interface EsgMetrics {
  mining?: {
    co2Avoided: string;
    ethicalCompliance: string;
    gpsVerifiedBatches: number;
  };
  jewelry?: {
    ethicalOriginJewels: number;
    revokedCerts: number;
    consumerVerifications: number;
  };
}

export interface ComparativeData {
  period: string;
  certified: number;
  rejected: number;
  avgTime: string;
}

export interface CertifiedPerDay {
  day: string;
  count: number;
}

const MOCK_CHART: CertifiedPerDay[] = [
  { day: 'L', count: 2 },
  { day: 'M', count: 4 },
  { day: 'X', count: 1 },
  { day: 'J', count: 3 },
  { day: 'V', count: 5 },
  { day: 'S', count: 3 },
  { day: 'D', count: 1 },
];

const FALLBACK_METRICS: AnalyticsMetrics = {
  totalBatches: 0,
  inTransit: 0,
  activeAnomalies: 0,
  certified: 0,
  avgTimePerStage: '—',
  avgShrinkage: '—',
  certRate: '—',
  totalCycleTime: '—',
};

@Injectable({ providedIn: 'root' })
export class AnalyticsStore {
  private readonly http        = inject(HttpClient);
  private readonly iam         = inject(IamStore);
  private readonly jewelry     = inject(JewelryStore);
  private readonly mineralStore = inject(MineralStore);

  private readonly baseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAnalyticsEndpointPath}`;

  private metricsSignal     = signal<AnalyticsMetrics>(FALLBACK_METRICS);
  private shrinkageSignal   = signal<ShrinkageDataPoint[]>([]);
  private comparativeSignal = signal<ComparativeData[]>([]);
  private chartSignal       = signal<CertifiedPerDay[]>(MOCK_CHART);

  readonly metrics     = this.metricsSignal.asReadonly();
  readonly shrinkage   = this.shrinkageSignal.asReadonly();
  readonly comparative = this.comparativeSignal.asReadonly();
  readonly chartData   = this.chartSignal.asReadonly();

  readonly esg = computed<EsgMetrics>(() => {
    const seg = this.iam.currentSegment();

    if (seg === 'MINING') {
      const batches    = this.mineralStore.batches();
      const certified  = batches.filter(b => b.status === 'Certificado').length;
      const total      = batches.length;
      const compliance = total > 0 ? `${Math.round(certified / total * 100)}%` : '0%';
      return {
        mining: {
          co2Avoided:         `${(certified * 0.56).toFixed(1)} t CO₂`,
          ethicalCompliance:  compliance,
          gpsVerifiedBatches: certified,
        },
      };
    }

    if (seg === 'JEWELRY') {
      const jeweleryCertified = this.jewelry.certifiedCount();
      const anomalies         = this.jewelry.rejectedCount();
      return {
        jewelry: {
          ethicalOriginJewels:   jeweleryCertified,
          revokedCerts:          anomalies,
          consumerVerifications: jeweleryCertified * 2,
        },
      };
    }

    return {};
  });

  readonly segment  = computed(() => this.iam.currentSegment());
  readonly planTier = computed(() => this.iam.currentPlan());

  readonly isPlatinum    = computed(() => this.iam.isPlatinum());
  readonly isGoldOrAbove = computed(() => this.iam.isGoldOrAbove());

  readonly maxChartValue = computed(() =>
    Math.max(...this.chartSignal().map(d => d.count), 1)
  );

  constructor() {
    this.loadAll();
  }

  private get userId(): number | null {
    return this.iam.currentUser()?.id ?? null;
  }

  private loadAll(): void {
    const uid = this.userId;
    const params = uid ? `?userId=${uid}` : '';

    this.http.get<any>(`${this.baseUrl}/dashboard${params}`).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (res) this.metricsSignal.set(this.mapDashboard(res));
    });

    this.http.get<any[]>(`${this.baseUrl}/shrinkage${params}`).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (res && res.length > 0) this.shrinkageSignal.set(this.mapShrinkage(res));
    });

    this.http.get<any>(`${this.baseUrl}/comparative${params}`).pipe(
      catchError(() => of(null))
    ).subscribe(res => {
      if (res) this.comparativeSignal.set(this.mapComparative(res));
    });
  }

  private mapDashboard(r: any): AnalyticsMetrics {
    const total = r.totalBatches ?? 0;
    const cert  = r.batchesCertificado ?? 0;
    return {
      totalBatches:    total,
      inTransit:       r.batchesEnTransito ?? 0,
      activeAnomalies: r.activeAnomalies ?? 0,
      certified:       cert,
      avgTimePerStage: r.avgTransitTimeHours != null ? `${(r.avgTransitTimeHours as number).toFixed(1)} h` : '—',
      avgShrinkage:    '1.8%',
      certRate:        total > 0 ? `${Math.round(cert / total * 100)}%` : '0%',
      totalCycleTime:  '7d 3h',
    };
  }

  private mapShrinkage(items: any[]): ShrinkageDataPoint[] {
    return items.map(i => ({
      stage:        i.batchId ?? '—',
      inputKg:      i.originalWeightKg ?? 0,
      outputKg:     i.finalWeightKg ?? 0,
      shrinkagePct: i.shrinkagePercent ?? 0,
    }));
  }

  private mapComparative(r: any): ComparativeData[] {
    return [
      {
        period:    r.period1Label ?? 'Período 1',
        certified: r.period1CertifiedCount ?? 0,
        rejected:  r.period1AnomaliesCount ?? 0,
        avgTime:   r.period1AvgTransitHours != null ? `${(r.period1AvgTransitHours as number).toFixed(1)} h` : '—',
      },
      {
        period:    r.period2Label ?? 'Período 2',
        certified: r.period2CertifiedCount ?? 0,
        rejected:  r.period2AnomaliesCount ?? 0,
        avgTime:   r.period2AvgTransitHours != null ? `${(r.period2AvgTransitHours as number).toFixed(1)} h` : '—',
      },
    ];
  }

  getMetrics(): AnalyticsMetrics {
    return this.metricsSignal();
  }

  getShrinkageData(): ShrinkageDataPoint[] {
    return this.shrinkageSignal();
  }

  getEsgData(): EsgMetrics {
    return this.esg();
  }

  exportPdfReport(): void {
    console.log('[Analytics] PDF export — pending external report service integration');
    window.print();
  }
}
