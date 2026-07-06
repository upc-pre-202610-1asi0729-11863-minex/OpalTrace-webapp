import { Component, inject, signal, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { JewelryStore } from '../../../application/jewelry.store';
import { IamStore } from '../../../../iam/application/iam.store';

interface TraceStep {
  labelKey: string;
  icon: string;
  dot: string;
  actor: string;
  timestamp: string;
  txHash: string;
}

@Component({
  selector: 'app-receive-material',
  standalone: true,
  imports: [FormsModule, DatePipe, TranslatePipe],
  templateUrl: './receive-material.html',
})
export class ReceiveMaterial implements OnDestroy {
  private store     = inject(JewelryStore);
  private translate = inject(TranslateService);
  private iam       = inject(IamStore);

  @ViewChild('videoEl') videoEl?: ElementRef<HTMLVideoElement>;

  batchId    = signal('');
  result     = signal<{ success: boolean; error?: string } | null>(null);
  loading    = signal(false);
  showTrace  = signal(false);

  cameraActive  = signal(false);
  cameraError   = signal<string | null>(null);
  cameraLoading = signal(false);

  private stream: MediaStream | null = null;

  readonly today = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  get traceSteps(): TraceStep[] {
    const company = this.iam.currentUser()?.companyName ?? 'Joyería';
    return [
      { labelKey: 'receive.trace-event-extracted', icon: 'ti-pickaxe',  dot: 'blue',  actor: 'Minas del Sur S.A.C.', timestamp: '2025-05-01T08:00:00Z', txHash: '0xA1B2C3D4' },
      { labelKey: 'receive.trace-event-transport', icon: 'ti-truck',     dot: 'blue',  actor: 'TransLog S.A.',         timestamp: '2025-05-02T10:00:00Z', txHash: '0xE5F6G7H8' },
      { labelKey: 'receive.trace-event-location',  icon: 'ti-map-pin',   dot: 'amber', actor: 'GPS Auto — Ruta Sur',   timestamp: '2025-05-03T14:00:00Z', txHash: '0xI9J0K1L2' },
      { labelKey: 'receive.trace-event-received',  icon: 'ti-inbox',     dot: 'green', actor: company,                 timestamp: new Date().toISOString(), txHash: '0xM3N4O5P6' },
    ];
  }

  async activateCamera(): Promise<void> {
    this.cameraLoading.set(true);
    this.cameraError.set(null);
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      this.cameraActive.set(true);
      setTimeout(() => {
        const video = this.videoEl?.nativeElement;
        if (video) { video.srcObject = this.stream; video.play(); }
      }, 50);
    } catch {
      this.cameraError.set(this.translate.instant('receive.camera-denied'));
    } finally {
      this.cameraLoading.set(false);
    }
  }

  stopCamera(): void {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.cameraActive.set(false);
  }

  receive(): void {
    if (!this.batchId().trim()) return;
    this.loading.set(true);
    this.result.set(null);
    this.showTrace.set(false);
    setTimeout(() => {
      const res = this.store.receiveMaterial(this.batchId().trim());
      this.result.set({
        success: res.success,
        error: res.errorKey ? this.translate.instant(res.errorKey, res.errorParams) : undefined,
      });
      this.loading.set(false);
    }, 600);
  }

  reset(): void {
    this.result.set(null);
    this.showTrace.set(false);
    this.batchId.set('');
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}
