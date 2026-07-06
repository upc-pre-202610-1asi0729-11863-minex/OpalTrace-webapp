import { Component, inject, signal, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ConsumerStore, VerifyResult } from '../../../application/consumer.store';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, TranslatePipe],
  templateUrl: './verify.html',
})
export class Verify implements OnInit, OnDestroy {
  private store     = inject(ConsumerStore);
  private translate = inject(TranslateService);
  private route     = inject(ActivatedRoute);

  @ViewChild('videoEl') videoEl?: ElementRef<HTMLVideoElement>;

  certInput   = signal('');
  result      = signal<VerifyResult | null>(null);
  loading     = signal(false);
  eventLogged = signal(false);

  cameraActive  = signal(false);
  cameraError   = signal<string | null>(null);
  cameraLoading = signal(false);

  private stream: MediaStream | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('certificateId');
    if (id) {
      this.certInput.set(id);
      this.verify();
    }
  }

  async activateCamera(): Promise<void> {
    this.cameraLoading.set(true);
    this.cameraError.set(null);
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      this.cameraActive.set(true);
      // Attach stream to video element after Angular renders it
      setTimeout(() => {
        const video = this.videoEl?.nativeElement;
        if (video) {
          video.srcObject = this.stream;
          video.play();
        }
      }, 50);
    } catch {
      this.cameraError.set(this.translate.instant('verify.camera-denied'));
    } finally {
      this.cameraLoading.set(false);
    }
  }

  stopCamera(): void {
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    this.cameraActive.set(false);
  }

  verify(): void {
    const id = this.certInput().trim();
    if (!id) return;
    this.loading.set(true);
    this.result.set(null);
    this.eventLogged.set(false);

    this.store.verifyQr(id).subscribe(res => {
      this.result.set({
        ...res,
        error: res.errorKey ? this.translate.instant(res.errorKey, res.errorParams) : undefined,
      });
      this.eventLogged.set(true);
      this.loading.set(false);
    });
  }

  reset(): void {
    this.result.set(null);
    this.certInput.set('');
    this.eventLogged.set(false);
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}
