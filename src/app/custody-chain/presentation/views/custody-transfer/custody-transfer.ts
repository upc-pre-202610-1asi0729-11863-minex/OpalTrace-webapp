import { Component, inject, signal, computed, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CustodyStore } from '../../../application/custody.store';

interface TransferResult {
  success: boolean;
  errorKey?: string;
  errorParams?: Record<string, string>;
}

@Component({
  selector: 'app-custody-transfer',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './custody-transfer.html',
})
export class CustodyTransfer implements OnDestroy {
  private store     = inject(CustodyStore);
  private translate = inject(TranslateService);

  @ViewChild('videoEl') videoEl?: ElementRef<HTMLVideoElement>;

  batchId = '';
  result  = signal<TransferResult | null>(null);
  loading = signal(false);

  cameraActive  = signal(false);
  cameraError   = signal<string | null>(null);
  cameraLoading = signal(false);

  private stream: MediaStream | null = null;

  private langSub: Subscription;
  private readonly langSignal = signal(this.translate.currentLang);

  readonly idPattern = /^OT-\d{4}-\d{4}$/;

  readonly errorMessage = computed(() => {
    const r = this.result();
    this.langSignal(); // reactive dependency on language
    if (!r || r.success || !r.errorKey) return '';

    const params = r.errorParams ?? {};
    if (params['statusKey']) {
      const status = this.translate.instant(params['statusKey']);
      const { statusKey: _unused, ...rest } = params;
      return this.translate.instant(r.errorKey, { ...rest, status });
    }
    return this.translate.instant(r.errorKey, params);
  });

  constructor() {
    this.langSub = this.translate.onLangChange.subscribe(() => {
      this.langSignal.set(this.translate.currentLang);
    });
  }

  get isValidFormat(): boolean {
    return this.idPattern.test(this.batchId.trim());
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
      this.cameraError.set(this.translate.instant('custody.camera-denied'));
    } finally {
      this.cameraLoading.set(false);
    }
  }

  stopCamera(): void {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.cameraActive.set(false);
  }

  async onSubmit(): Promise<void> {
    const id = this.batchId.trim().toUpperCase();
    if (!this.idPattern.test(id)) {
      this.result.set({ success: false, errorKey: 'custody.format-invalid' });
      return;
    }
    this.loading.set(true);
    this.result.set(null);

    const outcome = await this.store.acceptCustody(id);
    this.loading.set(false);
    if (!outcome.success) {
      this.result.set({ success: false, errorKey: outcome.errorKey, errorParams: outcome.errorParams });
    } else {
      this.result.set({ success: true });
      this.batchId = '';
    }
  }

  onReset(): void {
    this.batchId = '';
    this.result.set(null);
  }

  ngOnDestroy(): void {
    this.stopCamera();
    this.langSub.unsubscribe();
  }
}
