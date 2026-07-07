import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import jsPDF from 'jspdf';
import { JewelryStore } from '../../../application/jewelry.store';
import { JewelryCertificate } from '../../../domain/model/jewelry-certificate.entity';
import { MineralApi } from '../../../../mineral-extraction/infrastructure/mineral-api';
import { IamStore } from '../../../../iam/application/iam.store';

@Component({
  selector: 'app-certify',
  standalone: true,
  imports: [FormsModule, DatePipe, TranslatePipe],
  templateUrl: './certify.html',
})
export class Certify {
  private store      = inject(JewelryStore);
  private iam        = inject(IamStore);
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

  downloadCertPdf(cert: JewelryCertificate): void {
    const company = this.iam.currentUser()?.companyName ?? 'Joyería Elegant S.A.C.';
    const issued  = new Date(cert.issuedAt).toLocaleDateString('es-PE');
    const doc     = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(63, 129, 108);
    doc.text('OpalTrace', 20, 22);
    doc.setFontSize(13);
    doc.setTextColor(40, 40, 40);
    doc.text('CERTIFICADO DE AUTENTICIDAD — JOYERÍA', 20, 31);
    doc.setDrawColor(63, 129, 108);
    doc.setLineWidth(0.7);
    doc.line(20, 35, 190, 35);

    const row = (label: string, value: string, y: number) => {
      doc.setFont('helvetica', 'bold');   doc.setFontSize(10); doc.setTextColor(80, 80, 80);
      doc.text(label, 22, y);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 30, 30);
      doc.text(value, 80, y);
    };

    row('Nº Certificado:',   cert.certId,                    45);
    row('Producto:',          cert.productName,               53);
    row('Estado:',            cert.certState,                 61);
    row('Lote de origen:',   cert.batchId ?? '—',            69);
    row('Joyería emisora:',   cert.jewelerName ?? company,    77);
    row('Firma digital:',    cert.signatureValid ? 'Válida ✓' : 'Inválida ✗', 85);
    row('Fecha de emisión:', issued,                          93);

    doc.setDrawColor(220, 220, 220);
    doc.line(20, 100, 190, 100);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const qrNote = `Para verificar la autenticidad, escanee el código QR o ingrese el código ${cert.certId} en https://opaltrace.com/verify`;
    const lines = doc.splitTextToSize(qrNote, 170);
    doc.text(lines, 20, 112);

    doc.setFontSize(8); doc.setTextColor(150);
    doc.text('Certificado emitido por OpalTrace. La autenticidad puede verificarse en cualquier momento.', 20, 278);
    doc.text(`Generado el ${new Date().toLocaleDateString('es-PE')}`, 20, 283);

    doc.save(`${cert.certId}.pdf`);
  }
}
