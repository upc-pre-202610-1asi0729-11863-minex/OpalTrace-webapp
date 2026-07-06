import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { JewelryStore } from '../../../application/jewelry.store';
import { MineralApi } from '../../../../mineral-extraction/infrastructure/mineral-api';

@Component({
  selector: 'app-certify',
  standalone: true,
  imports: [FormsModule, DatePipe, TranslatePipe],
  templateUrl: './certify.html',
})
export class Certify {
  private store      = inject(JewelryStore);
  private mineralApi = inject(MineralApi);

  readonly certificates    = this.store.certificates;
  readonly receivedBatches = this.store.receivedBatches;

  readonly productTypes = ['Anillo', 'Collar', 'Pulsera', 'Aretes', 'Dije'];

  productName   = signal('');
  productType   = signal('');
  sourceBatchId = signal('');
  weightG       = signal<string>('');

  batchMineral        = signal<string>('');
  batchMineralLoading = signal<boolean>(false);

  certifyResult = signal<{
    success: boolean;
    certId?: string;
    productId?: string;
    productName?: string;
    error?: string;
  } | null>(null);

  readonly isFormValid = computed(() =>
    this.productName().trim().length > 0 &&
    this.productType().length > 0 &&
    this.sourceBatchId().length > 0 &&
    Number(this.weightG()) > 0
  );

  async onBatchSelect(batchId: string): Promise<void> {
    this.sourceBatchId.set(batchId);
    this.batchMineral.set('');
    this.certifyResult.set(null);
    if (!batchId) return;
    this.batchMineralLoading.set(true);
    try {
      const batch = await firstValueFrom(this.mineralApi.getBatchByBatchId(batchId));
      this.batchMineral.set(batch?.mineral ?? '');
    } catch {
      this.batchMineral.set('');
    } finally {
      this.batchMineralLoading.set(false);
    }
  }

  certify(): void {
    if (!this.isFormValid()) return;
    const result = this.store.createAndCertifyJewelry({
      name:          this.productName().trim(),
      productType:   this.productType(),
      material:      this.batchMineral(),
      sourceBatchId: this.sourceBatchId(),
      weightG:       Number(this.weightG()),
    });
    this.certifyResult.set(result);
  }

  qrImageUrl(certId: string): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://opaltrace.com/verify/' + certId)}`;
  }

  reset(): void {
    this.certifyResult.set(null);
    this.productName.set('');
    this.productType.set('');
    this.sourceBatchId.set('');
    this.weightG.set('');
    this.batchMineral.set('');
  }
}
