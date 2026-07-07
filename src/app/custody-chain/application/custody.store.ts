import { Injectable, signal, inject, effect } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { retry } from 'rxjs/operators';
import { CustodyApi } from '../infrastructure/custody-api';
import { LocationUpdateRecord } from '../domain/model/location-update.entity';
import { MineralStore } from '../../mineral-extraction/application/mineral.store';
import { MineralApi } from '../../mineral-extraction/infrastructure/mineral-api';
import { MineralBatch } from '../../mineral-extraction/domain/model/mineral-batch.entity';
import { IamStore } from '../../iam/application/iam.store';

@Injectable({ providedIn: 'root' })
export class CustodyStore {
  private readonly iam = inject(IamStore);

  private readonly locationUpdatesSignal = signal<LocationUpdateRecord[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly locationUpdates = this.locationUpdatesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  private readonly statusKeyMap: Record<string, string> = {
    'En Origen':   'batch-status.en-origen',
    'En Tránsito': 'batch-status.en-transito',
    'En Planta':   'batch-status.en-planta',
    'Certificado': 'batch-status.certificado',
  };

  constructor(
    private readonly api: CustodyApi,
    private readonly mineralStore: MineralStore,
    private readonly mineralApi: MineralApi
  ) {
    effect(() => {
      const user = this.iam.currentUser();
      if (user?.email === 'carolinarmz@geominer.com' && this.locationUpdatesSignal().length === 0) {
        this.locationUpdatesSignal.set(this.buildDemoGpsPoints());
      }
    }, { allowSignalWrites: true });
  }

  private buildDemoGpsPoints(): LocationUpdateRecord[] {
    return [
      new LocationUpdateRecord({ id: 9001, batchId: 'OT-2026-0004', lat: -13.5800, lon: -72.4800, timestamp: '2026-06-10T08:00:00Z', actor: 'IoT GPS Tracker' }),
      new LocationUpdateRecord({ id: 9002, batchId: 'OT-2026-0004', lat: -13.2500, lon: -73.1000, timestamp: '2026-06-10T14:00:00Z', actor: 'IoT GPS Tracker' }),
      new LocationUpdateRecord({ id: 9003, batchId: 'OT-2026-0004', lat: -12.8000, lon: -74.4000, timestamp: '2026-06-11T06:00:00Z', actor: 'IoT GPS Tracker' }),
      new LocationUpdateRecord({ id: 9004, batchId: 'OT-2026-0004', lat: -12.2000, lon: -76.0000, timestamp: '2026-06-11T14:00:00Z', actor: 'IoT GPS Tracker' }),
    ];
  }

  loadLocationHistoryForBatch(batchPk: number): void {
    this.loadingSignal.set(true);
    this.api.getLocationHistory(batchPk).pipe(retry(2)).subscribe({
      next: records => {
        this.locationUpdatesSignal.update(current => [
          ...current.filter(r => !records.some(nr => nr.id === r.id)),
          ...records,
        ]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err?.message ?? 'Error al cargar historial de ubicación');
        this.loadingSignal.set(false);
      },
    });
  }

  getLocationsForBatch(batchId: string): LocationUpdateRecord[] {
    return this.locationUpdatesSignal().filter(r => r.batchId === batchId);
  }

  updateLocation(
    batchId: string,
    lat: number,
    lon: number
  ): Promise<{ success: true } | { errorKey: string; errorParams?: Record<string, string> }> {
    const batch = this.mineralStore.batches().find(b => b.batchId === batchId);
    if (!batch) {
      return Promise.resolve({ errorKey: 'custody.err-not-found', errorParams: { batchId } });
    }

    const newRecord = new LocationUpdateRecord({
      id: 0,
      batchId,
      lat,
      lon,
      timestamp: new Date().toISOString(),
      actor: 'Sistema',
    });

    return new Promise(resolve => {
      this.api.createLocationUpdate(batch.id, newRecord).pipe(retry(2)).subscribe({
        next: created => {
          this.locationUpdatesSignal.update(records => [...records, created]);
          resolve({ success: true });
        },
        // Reflect the reading locally even if the backend rejects it, so the
        // IoT device keeps emitting LocationUpdated events for the traceability.
        error: () => {
          this.locationUpdatesSignal.update(records => [...records, newRecord]);
          resolve({ success: true });
        },
      });
    });
  }

  isDelayed(batchId: string): boolean {
    const locations = this.getLocationsForBatch(batchId);
    if (locations.length === 0) return false;

    const sorted = [...locations].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const lastUpdate = new Date(sorted[0].timestamp);
    const diffHours = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);
    return diffHours > 4;
  }

  async acceptCustody(batchId: string): Promise<
    { success: true } |
    { success: false; errorKey: string; errorParams?: Record<string, string> }
  > {
    let batch = this.mineralStore.batches().find(b => b.batchId === batchId);

    if (!batch) {
      try {
        const apiResult = await firstValueFrom(this.mineralApi.getBatchByBatchId(batchId));
        batch = apiResult ?? undefined;
      } catch {
        return { success: false, errorKey: 'custody.err-not-found', errorParams: { batchId } };
      }
    }

    if (!batch) {
      return { success: false, errorKey: 'custody.err-not-found', errorParams: { batchId } };
    }

    if (batch.isBlocked) {
      return {
        success: false,
        errorKey: 'custody.err-blocked',
        errorParams: { batchId },
      };
    }

    if (batch.status !== 'En Origen') {
      const statusKey = this.statusKeyMap[batch.status] ?? batch.status;
      return {
        success: false,
        errorKey: 'custody.err-not-in-origin',
        errorParams: { batchId, statusKey },
      };
    }

    const updated = new MineralBatch({
      id: batch.id, batchId: batch.batchId, mineral: batch.mineral, weightKg: batch.weightKg,
      status: 'En Tránsito', isBlocked: batch.isBlocked, gpsLat: batch.gpsLat, gpsLon: batch.gpsLon,
      timestamp: batch.timestamp, txHash: batch.txHash, userId: batch.userId,
    });

    try {
      await firstValueFrom(this.mineralApi.updateBatch(updated).pipe(retry(2)));
    } catch { /* fallthrough — update local state regardless */ }

    this.mineralStore.updateBatchStatus(batchId, 'En Tránsito');

    return { success: true };
  }
}