import { Injectable, signal, computed, inject } from '@angular/core';
import { IamStore } from '../../iam/application/iam.store';
import { AnalyticsMetric } from '../domain/model/analytics-metric.entity';

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

const MOCK_METRICS: AnalyticsMetrics = {
  totalBatches: 24,
  inTransit: 3,
  activeAnomalies: 2,
  certified: 11,
  avgTimePerStage: '4.2 h',
  avgShrinkage: '1.8%',
  certRate: '94%',
  totalCycleTime: '7d 3h',
};

const MOCK_SHRINKAGE: ShrinkageDataPoint[] = [
  { stage: 'Extracción → Transporte', inputKg: 450, outputKg: 442, shrinkagePct: 1.8 },
  { stage: 'Transporte → Refinería',  inputKg: 442, outputKg: 435, shrinkagePct: 1.6 },
  { stage: 'Refinería → Joyería',     inputKg: 435, outputKg: 427, shrinkagePct: 1.8 },
];

const MOCK_ESG: EsgMetrics = {
  mining: {
    co2Avoided: '12.4 t CO₂',
    ethicalCompliance: '96%',
    gpsVerifiedBatches: 22,
  },
  jewelry: {
    ethicalOriginJewels: 48,
    revokedCerts: 2,
    consumerVerifications: 134,
  },
};

const MOCK_COMPARATIVE: ComparativeData[] = [
  { period: 'Semana actual', certified: 11, rejected: 1, avgTime: '4.2 h' },
  { period: 'Semana pasada', certified: 9,  rejected: 2, avgTime: '4.8 h' },
  { period: 'Mes actual',    certified: 40, rejected: 4, avgTime: '4.5 h' },
];

const MOCK_CHART: CertifiedPerDay[] = [
  { day: 'L', count: 2 },
  { day: 'M', count: 4 },
  { day: 'X', count: 1 },
  { day: 'J', count: 3 },
  { day: 'V', count: 5 },
  { day: 'S', count: 3 },
  { day: 'D', count: 1 },
];

@Injectable({ providedIn: 'root' })
export class AnalyticsStore {
  private iam = inject(IamStore);

  private metricsSignal     = signal<AnalyticsMetrics>(MOCK_METRICS);
  private shrinkageSignal   = signal<ShrinkageDataPoint[]>(MOCK_SHRINKAGE);
  private esgSignal         = signal<EsgMetrics>(MOCK_ESG);
  private comparativeSignal = signal<ComparativeData[]>(MOCK_COMPARATIVE);
  private chartSignal       = signal<CertifiedPerDay[]>(MOCK_CHART);

  readonly metrics     = this.metricsSignal.asReadonly();
  readonly shrinkage   = this.shrinkageSignal.asReadonly();
  readonly esg         = this.esgSignal.asReadonly();
  readonly comparative = this.comparativeSignal.asReadonly();
  readonly chartData   = this.chartSignal.asReadonly();

  readonly segment  = computed(() => this.iam.currentSegment());
  readonly planTier = computed(() => this.iam.currentPlan());

  readonly isPlatinum    = computed(() => this.iam.isPlatinum());
  readonly isGoldOrAbove = computed(() => this.iam.isGoldOrAbove());

  readonly maxChartValue = computed(() =>
    Math.max(...this.chartSignal().map(d => d.count), 1)
  );

  getMetrics(): AnalyticsMetrics {
    return this.metricsSignal();
  }

  getShrinkageData(): ShrinkageDataPoint[] {
    return this.shrinkageSignal();
  }

  getEsgData(): EsgMetrics {
    return this.esgSignal();
  }

  exportPdfReport(): void {
    // In production: call backend PDF generation endpoint
    console.log('[AnalyticsStore] Exporting PDF report...');
    alert('Reporte PDF generado — integración con servicio de generación pendiente.');
  }
}