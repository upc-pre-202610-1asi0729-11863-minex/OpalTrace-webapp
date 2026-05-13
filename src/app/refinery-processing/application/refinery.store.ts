import { Injectable, signal, computed } from '@angular/core';
import { retry } from 'rxjs/operators';
import { RefineryApi } from '../infrastructure/refinery-api';
import { RefineryBatch, RefineryBatchStatus } from '../domain/model/refinery-batch.entity';
import { SubLot, SubLotStatus } from '../domain/model/sublot.entity';
import { ShrinkageRecord, ShrinkageType } from '../domain/model/shrinkage-record.entity';
import { MineralStore, MineralType } from '../../mineral-extraction/application/mineral.store';

export { RefineryBatch, SubLot, ShrinkageRecord };
export type { RefineryBatchStatus, SubLotStatus, ShrinkageType };

export interface WeightDiscrepancyAlert {
  batchId: string;
  expectedKg: number;
  receivedKg: number;
  diffPercent: number;
}

/** Efficiency shrinkage targets per mineral type (max acceptable %) */
export const WEIGHT_TARGETS: Record<MineralType, number> = {
  Oro:   2.5,
  Plata: 3.0
};

@Injectable({ providedIn: 'root' })
export class RefineryStore {
  private readonly batchesSignal = signal<RefineryBatch[]>([]);
  private readonly sublotsSignal = signal<SubLot[]>([]);
  private readonly shrinkageSignal = signal<ShrinkageRecord[]>([]);
  private readonly discrepancyAlertsSignal = signal<WeightDiscrepancyAlert[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly batches = this.batchesSignal.asReadonly();
  readonly sublots = this.sublotsSignal.asReadonly();
  readonly shrinkageRecords = this.shrinkageSignal.asReadonly();
  readonly discrepancyAlerts = this.discrepancyAlertsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly totalReceived = computed(() => this.batchesSignal().length);
  readonly totalSublots = computed(() => this.sublotsSignal().length);

  constructor(
    private readonly api: RefineryApi,
    private readonly mineralStore: MineralStore
  ) {
    this.loadRefineryBatches();
    this.loadSublots();
    this.loadShrinkageRecords();
  }

  private loadRefineryBatches(): void {
    this.api.getRefineryBatches().pipe(retry(2)).subscribe({
      next: batches => this.batchesSignal.set(batches),
      error: err => this.errorSignal.set(err?.message ?? 'Error al cargar lotes de refinería'),
    });
  }

  private loadSublots(): void {
    this.api.getSublots().pipe(retry(2)).subscribe({
      next: sublots => this.sublotsSignal.set(sublots),
      error: err => this.errorSignal.set(err?.message ?? 'Error al cargar sublotes'),
    });
  }

  private loadShrinkageRecords(): void {
    this.api.getShrinkageRecords().pipe(retry(2)).subscribe({
      next: records => this.shrinkageSignal.set(records),
      error: err => this.errorSignal.set(err?.message ?? 'Error al cargar registros de merma'),
    });
  }

  receiveBatch(
    batchId: string,
    receivedWeightKg: number,
    location = 'Refinería'
  ): Promise<{ success: true } | { error: string; alert?: WeightDiscrepancyAlert }> {
    const sourceBatch = this.mineralStore.batches().find(b => b.batchId === batchId);
    if (!sourceBatch) {
      return Promise.resolve({
        error: `Lote ${batchId} no encontrado en el registro de extracción. Verifique la trazabilidad.`,
      });
    }

    const alreadyReceived = this.batchesSignal().find(b => b.batchId === batchId);
    if (alreadyReceived) {
      return Promise.resolve({
        error: `El lote ${batchId} ya fue recibido en refinería el ${this.formatDate(alreadyReceived.receivedAt)}.`,
      });
    }

    const expectedKg = sourceBatch.weightKg;
    const diffKg = Math.abs(expectedKg - receivedWeightKg);
    const diffPercent = (diffKg / expectedKg) * 100;

    const newBatch = new RefineryBatch({
      id: 0,
      batchId,
      weightKg: receivedWeightKg,
      status: 'Recibido' as RefineryBatchStatus,
      receivedAt: new Date().toISOString(),
      location,
      mineral: sourceBatch.mineral ?? null,
    });

    return new Promise(resolve => {
      this.api.createRefineryBatch(newBatch).pipe(retry(2)).subscribe({
        next: created => {
          this.batchesSignal.update(bs => [...bs, created]);

          if (diffPercent > 2) {
            const alert: WeightDiscrepancyAlert = {
              batchId,
              expectedKg,
              receivedKg: receivedWeightKg,
              diffPercent: Math.round(diffPercent * 10) / 10,
            };
            this.discrepancyAlertsSignal.update(as => [...as, alert]);
            resolve({
              error: `WeightDiscrepancy: Diferencia de peso ${alert.diffPercent}% excede el límite del 2%. Esperado: ${expectedKg} kg — Recibido: ${receivedWeightKg} kg.`,
              alert,
            });
          } else {
            resolve({ success: true });
          }
        },
        error: err => resolve({ error: err?.message ?? 'Error al registrar lote en refinería' }),
      });
    });
  }

  splitBatch(
    parentId: string,
    sublotWeights: number[]
  ): Promise<{ success: true; sublots: SubLot[] } | { error: string }> {
    const parent = this.batchesSignal().find(b => b.batchId === parentId);
    if (!parent) {
      return Promise.resolve({ error: `Lote padre ${parentId} no encontrado en refinería.` });
    }

    const totalSplit = sublotWeights.reduce((sum, w) => sum + w, 0);
    if (Math.abs(totalSplit - parent.weightKg) > 0.01) {
      return Promise.resolve({
        error: `La suma de sublotes (${totalSplit} kg) debe ser igual al peso del lote padre (${parent.weightKg} kg). Diferencia: ${Math.abs(totalSplit - parent.weightKg).toFixed(2)} kg.`,
      });
    }

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const existingForParent = this.sublotsSignal().filter(s => s.parentBatchId === parentId);
    const offset = existingForParent.length;

    const sublotEntities = sublotWeights.map((weightKg, i) =>
      new SubLot({
        id: 0,
        sublotId: `${parentId}-${letters[(offset + i) % 26]}`,
        parentBatchId: parentId,
        weightKg,
        status: 'Activo' as SubLotStatus,
      })
    );

    return new Promise(resolve => {
      const created: SubLot[] = [];
      let pending = sublotEntities.length;
      let hasError = false;

      const finish = () => {
        if (hasError) return;
        this.sublotsSignal.update(ss => [...ss, ...created]);

        const updatedParent = new RefineryBatch({
          id: parent.id,
          batchId: parent.batchId,
          weightKg: parent.weightKg,
          status: 'En Proceso' as RefineryBatchStatus,
          receivedAt: parent.receivedAt,
          location: parent.location,
          mineral: parent.mineral,
        });

        this.api.updateRefineryBatch(updatedParent).pipe(retry(2)).subscribe({
          next: updated => {
            this.batchesSignal.update(bs =>
              bs.map(b => b.batchId === parentId ? updated : b)
            );
            resolve({ success: true, sublots: created });
          },
          error: err => resolve({ error: err?.message ?? 'Error al actualizar lote padre' }),
        });
      };

      for (const sublotEntity of sublotEntities) {
        this.api.createSublot(sublotEntity).pipe(retry(2)).subscribe({
          next: s => {
            created.push(s);
            pending--;
            if (pending === 0) finish();
          },
          error: err => {
            if (!hasError) {
              hasError = true;
              resolve({ error: err?.message ?? 'Error al crear sublote' });
            }
          },
        });
      }
    });
  }

  registerShrinkage(
    batchId: string,
    percentage: number,
    type: ShrinkageType
  ): Promise<{ success: true } | { error: string }> {
    if (percentage < 0 || percentage > 100) {
      return Promise.resolve({ error: 'El porcentaje de merma debe estar entre 0 y 100.' });
    }

    const batch = this.batchesSignal().find(b => b.batchId === batchId);
    if (!batch) {
      return Promise.resolve({ error: `Lote ${batchId} no encontrado en refinería.` });
    }

    const record = new ShrinkageRecord({
      id: 0,
      batchId,
      percentage,
      type,
      timestamp: new Date().toISOString(),
    });

    return new Promise(resolve => {
      this.api.createShrinkageRecord(record).pipe(retry(2)).subscribe({
        next: created => {
          this.shrinkageSignal.update(rs => [...rs, created]);
          resolve({ success: true });
        },
        error: err => resolve({ error: err?.message ?? 'Error al registrar merma' }),
      });
    });
  }

  isWithinTarget(batchId: string, percentage: number): boolean {
    const batch = this.batchesSignal().find(b => b.batchId === batchId);
    if (!batch?.mineral) return true;
    const target = WEIGHT_TARGETS[batch.mineral as MineralType];
    return target !== undefined ? percentage <= target : true;
  }

  getTargetForBatch(batchId: string): number | null {
    const batch = this.batchesSignal().find(b => b.batchId === batchId);
    if (!batch?.mineral) return null;
    return WEIGHT_TARGETS[batch.mineral as MineralType] ?? null;
  }

  getSublotsForBatch(parentId: string): SubLot[] {
    return this.sublotsSignal().filter(s => s.parentBatchId === parentId);
  }

  getShrinkageForBatch(batchId: string): ShrinkageRecord[] {
    return this.shrinkageSignal().filter(r => r.batchId === batchId);
  }

  private formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-PE');
  }
}
