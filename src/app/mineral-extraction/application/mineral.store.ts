import { Injectable, inject, signal, computed, effect, untracked } from '@angular/core';
import { retry } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MineralApi } from '../infrastructure/mineral-api';
import { MineralBatch, MineralType, BatchStatus } from '../domain/model/mineral-batch.entity';
import { AnomalyAlert, AlertType } from '../domain/model/anomaly-alert.entity';
import { IamStore } from '../../iam/application/iam.store';
import { LocalPersistence } from '../../shared/infrastructure/local-persistence';

interface MineralBatchProps {
  id: number; batchId: string; mineral: MineralType; weightKg: number;
  status: BatchStatus; isBlocked: boolean; gpsLat: number; gpsLon: number;
  timestamp: string; txHash: string; userId: number; anomalyReason: string | null;
}

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
  private readonly api         = inject(MineralApi);
  private readonly iam         = inject(IamStore);
  private readonly translate   = inject(TranslateService);
  private readonly persistence = inject(LocalPersistence);

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
    this.hydrateFromCache();
    this.loadBatches();
    effect(() => {
      const props = this.batchesSignal().map(b => this.toProps(b));
      this.persistence.write<MineralBatchProps>('batches', props);
    });
    effect(() => {
      const user = this.iam.currentUser();
      untracked(() => {
        if (user?.email === 'carolinarmz@geominer.com' && this.batchesSignal().length === 0) {
          this.batchesSignal.set(this.buildDemoBatches(user.id));
        }
      });
    }, { allowSignalWrites: true });
  }

  private buildDemoBatches(userId: number): MineralBatch[] {
    return [
      new MineralBatch({ id: 9001, batchId: 'OT-2025-0001', mineral: 'Oro',   weightKg: 450, status: 'Certificado', isBlocked: false, gpsLat: -13.5328, gpsLon: -72.4442, timestamp: '2025-03-10T08:00:00Z', txHash: '0xabc1230001', userId }),
      new MineralBatch({ id: 9002, batchId: 'OT-2025-0002', mineral: 'Plata', weightKg: 320, status: 'Certificado', isBlocked: false, gpsLat: -13.5000, gpsLon: -72.4000, timestamp: '2025-03-12T08:00:00Z', txHash: '0xabc1230002', userId }),
      new MineralBatch({ id: 9003, batchId: 'OT-2025-0003', mineral: 'Plata', weightKg: 280, status: 'Certificado', isBlocked: false, gpsLat: -13.7800, gpsLon: -72.6230, timestamp: '2025-03-18T08:00:00Z', txHash: '0xabc1230003', userId }),
      new MineralBatch({ id: 9005, batchId: 'OT-2025-0005', mineral: 'Oro',   weightKg: 500, status: 'Certificado', isBlocked: false, gpsLat: -13.5800, gpsLon: -72.4800, timestamp: '2025-03-20T08:00:00Z', txHash: '0xabc1230005', userId }),
    ];
  }

  private toProps(b: MineralBatch): MineralBatchProps {
    return {
      id: b.id, batchId: b.batchId, mineral: b.mineral, weightKg: b.weightKg,
      status: b.status, isBlocked: b.isBlocked, gpsLat: b.gpsLat, gpsLon: b.gpsLon,
      timestamp: b.timestamp, txHash: b.txHash, userId: b.userId, anomalyReason: b.anomalyReason,
    };
  }

  private hydrateFromCache(): void {
    const cached = this.persistence.read<MineralBatchProps>('batches');
    if (cached.length > 0) {
      this.batchesSignal.set(cached.map(p => new MineralBatch(p)));
    }
  }

  private loadBatches(): void {
    const userId = this.iam.currentUser()?.id;
    if (!userId) return;
    this.loadingSignal.set(true);
    this.api.getBatchesByUser(userId).pipe(retry(2)).subscribe({
      next: batches => {
        // Merge backend batches over the cached snapshot (backend wins on conflict).
        // An empty backend response never discards locally registered batches.
        if (batches.length > 0) {
          this.batchesSignal.update(cached => {
            const byBatchId = new Map(cached.map(b => [b.batchId, b]));
            batches.forEach(b => byBatchId.set(b.batchId, b));
            return Array.from(byBatchId.values());
          });
        }
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

  updateBatchStatus(batchId: string, status: BatchStatus): void {
    this.batchesSignal.update(bs =>
      bs.map(b => {
        if (b.batchId !== batchId) return b;
        return new MineralBatch({
          id: b.id, batchId: b.batchId, mineral: b.mineral, weightKg: b.weightKg,
          status, isBlocked: b.isBlocked, gpsLat: b.gpsLat, gpsLon: b.gpsLon,
          timestamp: b.timestamp, txHash: b.txHash, userId: b.userId,
        });
      })
    );
  }
}
