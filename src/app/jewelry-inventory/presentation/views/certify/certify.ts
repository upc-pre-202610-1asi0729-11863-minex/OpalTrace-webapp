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

  async downloadCertPdf(cert: JewelryCertificate): Promise<void> {
    const company = this.iam.currentUser()?.companyName ?? 'Joyería Elegant S.A.C.';
    const issued  = new Date(cert.issuedAt).toLocaleDateString('es-PE');
    const doc     = new jsPDF();
    const qrData  = encodeURIComponent(`https://opaltrace.com/verify/${cert.certId}`);

    const [logoDataUrl, qrDataUrl] = await Promise.all([
      this.loadImageAsDataUrl('assets/opaltrace-logo.svg', 200, 55),
      this.fetchImageAsDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}`),
    ]);

    // Logo
    if (logoDataUrl) doc.addImage(logoDataUrl, 'PNG', 15, 8, 48, 13);
    doc.setFontSize(8); doc.setTextColor(120);
    doc.text('BY MINEX', 64, 18);

    // Title
    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(63, 129, 108);
    doc.text('CERTIFICADO DE AUTENTICIDAD — JOYERÍA', 20, 30);
    doc.setDrawColor(63, 129, 108); doc.setLineWidth(0.7);
    doc.line(20, 33, 190, 33);

    const row = (label: string, value: string, y: number) => {
      doc.setFont('helvetica', 'bold');   doc.setFontSize(9.5); doc.setTextColor(90, 90, 90);
      doc.text(label, 22, y);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(25, 25, 25);
      doc.text(value, 78, y);
    };

    row('Nº Certificado:',  cert.certId,                                       42);
    row('Producto:',         cert.productName,                                  50);
    row('Tipo:',             (cert as any).productType ?? '—',                 58);
    row('Estado:',           cert.certState,                                    66);
    row('Lote de origen:',  cert.batchId ?? '—',                               74);
    row('Joyería emisora:',  cert.jewelerName ?? company,                       82);
    row('Firma digital:',   cert.signatureValid ? 'Válida ✓' : 'Inválida ✗',  90);
    row('Fecha de emisión:', issued,                                            98);

    doc.setDrawColor(220); doc.line(20, 106, 190, 106);

    // Traceability section
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(63, 129, 108);
    doc.text('TRAZABILIDAD DEL ORIGEN', 20, 115);

    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(70, 70, 70);
    const traceLines = [
      `• Mineral de origen extraído por GeoMiner S.A.C. con certificación MINEX.`,
      `• Lote ${cert.batchId ?? '—'} verificado en blockchain — sin anomalías registradas.`,
      `• Joyería certificada bajo estándares OpalTrace de origen ético y responsable.`,
      `• Firma digital de autenticidad emitida y registrada el ${issued}.`,
    ];
    let y = 123;
    traceLines.forEach(line => { doc.text(line, 22, y); y += 7; });

    // QR
    doc.setFontSize(8); doc.setTextColor(90); doc.setFont('helvetica', 'bold');
    doc.text('Código QR de verificación', 148, 148);
    if (qrDataUrl) doc.addImage(qrDataUrl, 'PNG', 148, 150, 38, 38);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(120);
    doc.text('opaltrace.com/verify', 148, 191);

    // Footer
    doc.setFontSize(7.5); doc.setTextColor(150);
    doc.text('Certificado emitido por OpalTrace. La autenticidad puede verificarse en cualquier momento.', 20, 280);
    doc.text(`Generado el ${new Date().toLocaleDateString('es-PE')}`, 20, 285);

    doc.save(`${cert.certId}.pdf`);
  }

  private loadImageAsDataUrl(src: string, w: number, h: number): Promise<string | null> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  private fetchImageAsDataUrl(url: string): Promise<string | null> {
    return fetch(url)
      .then(r => r.blob())
      .then(blob => new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      }))
      .catch(() => null);
  }
}
