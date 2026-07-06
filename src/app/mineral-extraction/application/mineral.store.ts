import { Injectable, inject, signal, computed } from '@angular/core';
import { retry } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MineralApi } from '../infrastructure/mineral-api';
import { MineralBatch, MineralType, BatchStatus } from '../domain/model/mineral-batch.entity';
import { AnomalyAlert, AlertType } from '../domain/model/anomaly-alert.entity';
import { IamStore } from '../../iam/application/iam.store';

export { MineralBatch, AnomalyAlert };
export type { MineralType, BatchStatus, AlertType };

export interface OfflineRecord {
  id: string;
  timestamp: string;
  status: 'PENDING' | 'SYNCED';
  mineral: MineralType;
  weightKg: number;
}

export const WEIGHT_RANGES: Record<MineralType, { min: number; max: number }> = {
  Oro:   { min: 50,  max: 500 },
  Plata: { min: 100, max: 800 },
};

@Injectable({ providedIn: 'root' })
export class MineralStore {
  private readonly api       = inject(MineralApi);
  private readonly iam       = inject(IamStore);
  private readonly translate = inject(TranslateService);

  private readonly batchesSignal  = signal<MineralBatch[]>([]);
  private readonly alertsSignal   = signal<AnomalyAlert[]>([]);
  private readonly offlineSignal  = signal<OfflineRecord[]>([]);
  private readonly loadingSignal  = signal<boolean>(false);
  private readonly errorSignal    = signal<string | null>(null);

  readonly batches      = this.batchesSignal.asReadonly();
  readonly alerts       = this.alertsSignal.asReadonly();
  readonly loading      = this.loadingSignal.asReadonly();
  readonly error        = this.errorSignal.asReadonly();
  readonly offlineQueue = this.offlineSignal.asReadonly();
  readonly pendingCount = computed(() => this.offlineSignal().filter(r => r.status === 'PENDING').length);

  private alertSeq = 4;

  constructor() {
    this.loadBatches();
  }

  private loadBatches(): void {
    const userId = this.iam.currentUser()?.id;
    if (!userId) return;
    this.loadingSignal.set(true);
    this.api.getBatchesByUser(userId).pipe(retry(2)).subscribe({
      next: batches => {
        this.batchesSignal.set(batches);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err.message ?? 'Error al cargar lotes');
        this.loadingSignal.set(false);
      },
    });
  }

  loadAlertsByBatch(batchPk: number): void {
    this.api.getAlertsByBatch(batchPk).pipe(retry(2)).subscribe({
      next: alerts => this.alertsSignal.update(current => [
        ...current.filter(a => !alerts.some(na => na.alertId === a.alertId)),
        ...alerts,
      ]),
      error: err => this.errorSignal.set(err.message ?? 'Error al cargar alertas'),
    });
  }

  registerBatch(data: {
    mineral: MineralType;
    weightKg: number;
    gpsLat: number;
    gpsLon: number;
  }): { success: boolean; error?: string; batchId?: string } {
    const range = WEIGHT_RANGES[data.mineral];
    if (data.weightKg < range.min || data.weightKg > range.max) {
      const mineralLabel = this.translate.instant(`mineral.${data.mineral}`);
      return { success: false, error: this.translate.instant('register-batch.err-weight-range', { mineral: mineralLabel, min: range.min, max: range.max }) };
    }

    const seq = this.batchesSignal().length + 1;
    const year = new Date().getFullYear();
    const batchId = `OT-${year}-${String(seq).padStart(4, '0')}`;

    const newBatch = new MineralBatch({
      id: 0,
      batchId,
      mineral: data.mineral,
      weightKg: data.weightKg,
      status: 'En Origen',
      isBlocked: false,
      gpsLat: data.gpsLat,
      gpsLon: data.gpsLon,
      timestamp: new Date().toISOString(),
      txHash: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
      userId: this.iam.currentUser()?.id ?? 0,
    });

    this.api.createBatch(newBatch).pipe(retry(2)).subscribe({
      next: created => this.batchesSignal.update(bs => [...bs, created]),
      error: () => this.batchesSignal.update(bs => [...bs, newBatch]),
    });

    return { success: true, batchId };
  }

  reportAnomaly(batchId: string, type: AlertType, description: string): void {
    const newAlert = new AnomalyAlert({
      id: 0,
      alertId: `ALR-${String(this.alertSeq++).padStart(3, '0')}`,
      batchId,
      type,
      description,
      timestamp: new Date().toISOString(),
    });

    const batchEntity = this.batchesSignal().find(b => b.batchId === batchId);
    if (batchEntity) {
      this.api.createAlert(batchEntity.id, newAlert).pipe(retry(2)).subscribe({
        next: created => this.alertsSignal.update(as => [...as, created]),
        error: () => this.alertsSignal.update(as => [...as, newAlert]),
      });
    } else {
      this.alertsSignal.update(as => [...as, newAlert]);
    }

    this.batchesSignal.update(bs =>
      bs.map(b => {
        if (b.batchId === batchId) {
          const updated = new MineralBatch({
            id: b.id, batchId: b.batchId, mineral: b.mineral, weightKg: b.weightKg,
            status: b.status, isBlocked: true, gpsLat: b.gpsLat, gpsLon: b.gpsLon,
            timestamp: b.timestamp, txHash: b.txHash, userId: b.userId,
          });
          this.api.updateBatch(updated).pipe(retry(2)).subscribe();
          return updated;
        }
        return b;
      })
    );
  }

  resolveAlert(alertId: string): void {
    this.alertsSignal.update(as => as.filter(a => a.alertId !== alertId));
    this.batchesSignal.update(bs =>
      bs.map(b => {
        const wasCausedByAlert = this.alertsSignal().length === 0;
        if (wasCausedByAlert && b.isBlocked) {
          const unblocked = new MineralBatch({
            id: b.id, batchId: b.batchId, mineral: b.mineral, weightKg: b.weightKg,
            status: b.status, isBlocked: false, gpsLat: b.gpsLat, gpsLon: b.gpsLon,
            timestamp: b.timestamp, txHash: b.txHash, userId: b.userId,
          });
          this.api.updateBatch(unblocked).pipe(retry(2)).subscribe();
          return unblocked;
        }
        return b;
      })
    );
  }

  generateQr(batchId: string): { url: string; expiresAt: string } | null {
    const batch = this.batchesSignal().find(b => b.batchId === batchId);
    if (!batch) return null;
    return {
      url: `https://opaltrace.com/verify/${batchId}`,
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    };
  }

  addToOfflineQueue(mineral: MineralType, weightKg: number): string {
    const id = `TEMP-${Date.now()}`;
    const record: OfflineRecord = {
      id,
      timestamp: new Date().toISOString(),
      status: 'PENDING',
      mineral,
      weightKg,
    };
    this.offlineSignal.update(q => [...q, record]);
    return id;
  }

  syncOfflineQueue(): void {
    this.offlineSignal.update(q =>
      q.map(r => ({ ...r, status: 'SYNCED' as const }))
    );
  }
}
