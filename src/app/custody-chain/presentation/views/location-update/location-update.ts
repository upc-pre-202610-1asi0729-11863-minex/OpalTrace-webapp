import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustodyStore } from '../../../application/custody.store';
import { LocationUpdateRecord as GpsPoint } from '../../../domain/model/location-update.entity';
import { MineralStore, BatchStatus } from '../../../../mineral-extraction/application/mineral.store';

interface UpdateResult {
  success: boolean;
  error?: string;
}

/**
 * Location Update view.
 * Route: /custody/location
 * Shows status flow, GPS map placeholder, delay warning, and GPS update form.
 */
@Component({
  selector: 'app-location-update',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './location-update.html',
})
export class LocationUpdate {
  private custodyStore = inject(CustodyStore);
  private mineralStore = inject(MineralStore);

  /** Form fields */
  selectedBatchId = 'OT-2025-0013';
  latInput: number | null = null;
  lonInput: number | null = null;
  result = signal<UpdateResult | null>(null);

  readonly statusSteps: BatchStatus[] = ['En Origen', 'En Tránsito', 'En Planta', 'Certificado'];

  /** Batches currently in transit */
  readonly transitBatches = computed(() =>
    this.mineralStore.batches().filter(b => b.status === 'En Tránsito')
  );

  /** GPS points for the selected batch */
  readonly gpsPoints = computed(() =>
    this.custodyStore.getLocationsForBatch(this.selectedBatchId)
  );

  /** Current status for the selected batch */
  readonly currentStatus = computed((): BatchStatus => {
    const batch = this.mineralStore.batches().find(b => b.batchId === this.selectedBatchId);
    return (batch?.status ?? 'En Tránsito') as BatchStatus;
  });

  /** True if the selected batch has a delayed transport */
  readonly isDelayed = computed(() =>
    this.custodyStore.isDelayed(this.selectedBatchId)
  );

  stepClass(step: BatchStatus): string {
    const order: Record<BatchStatus, number> = {
      'En Origen': 0,
      'En Tránsito': 1,
      'En Planta': 2,
      'Certificado': 3,
    };
    const current = order[this.currentStatus()];
    const stepIdx  = order[step];
    if (stepIdx < current)  return 'status-step done';
    if (stepIdx === current) return 'status-step active';
    return 'status-step';
  }

  onSubmit(): void {
    if (this.latInput == null || this.lonInput == null) {
      this.result.set({ success: false, error: 'Ingresa latitud y longitud.' });
      return;
    }
    if (this.latInput < -90 || this.latInput > 90) {
      this.result.set({ success: false, error: 'Latitud debe estar entre -90 y 90.' });
      return;
    }
    if (this.lonInput < -180 || this.lonInput > 180) {
      this.result.set({ success: false, error: 'Longitud debe estar entre -180 y 180.' });
      return;
    }

    this.custodyStore.updateLocation(
      this.selectedBatchId,
      this.latInput,
      this.lonInput
    ).then(outcome => {
      if ('error' in outcome) {
        this.result.set({ success: false, error: outcome.error });
      } else {
        this.result.set({ success: true });
        this.latInput = null;
        this.lonInput = null;
      }
    });
  }

  onReset(): void {
    this.result.set(null);
    this.latInput = null;
    this.lonInput = null;
  }

  formatCoords(point: GpsPoint): string {
    return `${point.lat.toFixed(4)}, ${point.lon.toFixed(4)}`;
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleString('es-PE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }
}
