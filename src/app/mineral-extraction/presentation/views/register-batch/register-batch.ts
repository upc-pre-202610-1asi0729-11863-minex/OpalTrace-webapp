import { Component, inject, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MineralStore, MineralType } from '../../../application/mineral.store';

interface RegisterResult {
  success: boolean;
  batchId?: string;
  error?: string;
}

/**
 * Register-batch view.
 * Allows operators to register a new mineral batch with GPS coordinates
 * (simulated as the authorized Lima zone: -12.0464, -77.0428).
 * Handles offline mode: when isOffline is true the form entry is queued locally.
 */
@Component({
  selector: 'app-register-batch',
  imports: [FormsModule, DatePipe, TranslatePipe],
  templateUrl: './register-batch.html',
  styleUrl: './register-batch.css',
})
export class RegisterBatch implements OnDestroy {
  private store     = inject(MineralStore);
  private translate = inject(TranslateService);

  readonly mineralTypes: MineralType[] = ['Oro', 'Plata'];
  selectedMineral: MineralType = 'Oro';
  weightKg: number | null = null;

  readonly pendingCount = this.store.pendingCount;
  readonly offlineQueue = this.store.offlineQueue;

  readonly gpsLat =  -12.0464;
  readonly gpsLon = -77.0428;
  readonly gpsLabel = `${this.gpsLat}, ${this.gpsLon} (Zona Norte Lima)`;

  evidencePhoto: File | null = null;
  evidencePhotoName = signal<string | null>(null);

  isOffline = signal(!navigator.onLine);
  result    = signal<RegisterResult | null>(null);
  submitted = signal(false);

  private readonly onOnline  = () => this.isOffline.set(false);
  private readonly onOffline = () => this.isOffline.set(true);

  constructor() {
    window.addEventListener('online',  this.onOnline);
    window.addEventListener('offline', this.onOffline);
  }

  ngOnDestroy(): void {
    window.removeEventListener('online',  this.onOnline);
    window.removeEventListener('offline', this.onOffline);
  }

  onSubmit(): void {
    if (!this.weightKg || this.weightKg <= 0) {
      this.result.set({ success: false, error: this.translate.instant('register-batch.err-weight') });
      return;
    }

    if (this.isOffline()) {
      const tempId = this.store.addToOfflineQueue(this.selectedMineral, this.weightKg);
      this.result.set({ success: true, batchId: tempId });
      this.submitted.set(true);
      return;
    }

    const outcome = this.store.registerBatch({
      mineral: this.selectedMineral,
      weightKg: this.weightKg,
      gpsLat: this.gpsLat,
      gpsLon: this.gpsLon,
    });

    if (!outcome.success) {
      this.result.set({ success: false, error: outcome.error });
    } else {
      this.result.set({ success: true, batchId: outcome.batchId });
      this.submitted.set(true);
      this.weightKg = null;
    }
  }

  onPhotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.evidencePhoto = file;
    this.evidencePhotoName.set(file?.name ?? null);
  }

  onReset(): void {
    this.result.set(null);
    this.submitted.set(false);
    this.weightKg = null;
    this.evidencePhoto = null;
    this.evidencePhotoName.set(null);
  }

  syncQueue(): void {
    this.store.syncOfflineQueue();
  }
}
