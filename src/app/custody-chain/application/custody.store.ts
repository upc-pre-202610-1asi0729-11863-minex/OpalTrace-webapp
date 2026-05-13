import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { retry } from 'rxjs/operators';
import { CustodyApi } from '../infrastructure/custody-api';
import { LocationUpdateRecord } from '../domain/model/location-update.entity';
import { MineralStore } from '../../mineral-extraction/application/mineral.store';
import { MineralApi } from '../../mineral-extraction/infrastructure/mineral-api';

@Injectable({ providedIn: 'root' })
export class CustodyStore {
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
    this.loadLocationUpdates();
  }

  private loadLocationUpdates(): void {
    this.loadingSignal.set(true);
    this.api.getLocationUpdates().pipe(retry(2)).subscribe({
      next: records => {
        this.locationUpdatesSignal.set(records);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(err?.message ?? 'Error al cargar actualizaciones de ubicación');
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
  ): Promise<{ success: true } | { error: string }> {
    const batch = this.mineralStore.batches().find(b => b.batchId === batchId);
    if (!batch) {
      return Promise.resolve({ error: `Lote ${batchId} no encontrado` });
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
      this.api.createLocationUpdate(newRecord).pipe(retry(2)).subscribe({
        next: created => {
          this.locationUpdatesSignal.update(records => [...records, created]);
          resolve({ success: true });
        },
        error: err => {
          resolve({ error: err?.message ?? 'Error al registrar actualización de ubicación' });
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

    if (batch.isBlocked || batch.status !== 'En Tránsito') {
      const statusKey = batch.isBlocked ? 'batch-status.bloqueado' : (this.statusKeyMap[batch.status] ?? batch.status);
      return {
        success: false,
        errorKey: 'custody.err-not-in-transit',
        errorParams: { batchId, statusKey },
      };
    }

    return { success: true };
  }
}