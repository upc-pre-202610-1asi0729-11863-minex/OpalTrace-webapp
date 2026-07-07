import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import { MineralStore } from '../../../application/mineral.store';
import { IamStore } from '../../../../iam/application/iam.store';

interface CustodyEvent {
  label: string;
  eventType: string;
  icon: string;
  dot: 'blue' | 'amber' | 'green';
  actor: string;
  detail: string;
  timestamp: string;
  txHash: string;
}

@Component({
  selector: 'app-batch-certificate',
  standalone: true,
  imports: [DatePipe, RouterLink, TranslatePipe],
  templateUrl: './batch-certificate.html',
})
export class BatchCertificate implements OnInit {
  private store  = inject(MineralStore);
  private iam    = inject(IamStore);
  private route  = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly companyName = computed(() => this.iam.currentUser()?.companyName ?? 'GeoMiner S.A.C.');

  batchId   = signal('');
  activeTab = signal<'cert' | 'events'>('cert');
  readonly encodeURIComponent = encodeURIComponent;

  readonly batch = computed(() =>
    this.store.batches().find(b => b.batchId === this.batchId())
  );

  readonly certId = computed(() =>
    this.batchId() ? `ORIG-${this.batchId()}` : ''
  );

  readonly events = computed<CustodyEvent[]>(() => {
    const b = this.batch();
    if (!b) return [];
    const h = b.txHash ?? '0x000000';
    const base = h.slice(0, Math.min(h.length - 2, h.length));
    return [
      {
        label: 'Extracción verificada',
        eventType: 'MineralExtracted',
        icon: 'ti-pickaxe',
        dot: 'blue',
        actor: this.iam.currentUser()?.companyName ?? 'GeoMiner S.A.C.',
        detail: `Zona autorizada · GPS: ${b.gpsLat.toFixed(4)}°S, ${b.gpsLon.toFixed(4)}°W`,
        timestamp: b.timestamp,
        txHash: h,
      },
      {
        label: 'Transporte verificado',
        eventType: 'TransportStarted',
        icon: 'ti-truck',
        dot: 'blue',
        actor: 'Logística Sur E.I.R.L.',
        detail: 'Custodia íntegra · Sin desvíos · GPS continuo registrado',
        timestamp: b.timestamp,
        txHash: base + '11',
      },
      {
        label: 'Procesamiento en refinería',
        eventType: 'BatchReceived',
        icon: 'ti-building-factory',
        dot: 'amber',
        actor: 'Refinería Lima S.A.',
        detail: `Peso recibido: ${b.weightKg} kg · Sin discrepancias · Área certificada`,
        timestamp: b.timestamp,
        txHash: base + '22',
      },
      {
        label: 'Certificado de origen emitido',
        eventType: 'CertificateIssued',
        icon: 'ti-certificate',
        dot: 'green',
        actor: 'OpalTrace / MINEX',
        detail: 'Cadena de trazabilidad íntegra · Certificado de Origen registrado',
        timestamp: b.timestamp,
        txHash: base + '33',
      },
    ];
  });

  ngOnInit(): void {
    this.batchId.set(this.route.snapshot.paramMap.get('batchId') ?? '');
  }

  switchTab(tab: 'cert' | 'events'): void {
    this.activeTab.set(tab);
  }

  async downloadPdf(): Promise<void> {
    const b = this.batch();
    if (!b) return;
    const doc     = new jsPDF();
    const company = this.companyName();
    const certId  = `ORIG-${b.batchId}`;
    const issued  = new Date(b.timestamp).toLocaleDateString('es-PE');
    const qrData  = encodeURIComponent(`https://opaltrace.com/verify/${b.batchId}`);

    // Load logo and QR in parallel
    const [logoDataUrl, qrDataUrl] = await Promise.all([
      this.loadImageAsDataUrl('assets/opaltrace-logo.svg', 200, 55),
      this.fetchImageAsDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}`),
    ]);

    // Logo
    if (logoDataUrl) doc.addImage(logoDataUrl, 'PNG', 15, 8, 48, 13);
    doc.setFontSize(8); doc.setTextColor(120);
    doc.text('BY MINEX', 64, 18);

    // Title block
    doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(63, 129, 108);
    doc.text('CERTIFICADO DE ORIGEN MINERAL', 20, 30);
    doc.setDrawColor(63, 129, 108); doc.setLineWidth(0.7);
    doc.line(20, 33, 190, 33);

    const row = (label: string, value: string, y: number) => {
      doc.setFont('helvetica', 'bold');   doc.setFontSize(9.5); doc.setTextColor(90, 90, 90);
      doc.text(label, 22, y);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(25, 25, 25);
      doc.text(value, 78, y);
    };

    row('Nº Certificado:',    certId,                                              42);
    row('ID de Lote:',         b.batchId,                                           50);
    row('Mineral:',            b.mineral,                                           58);
    row('Peso registrado:',   `${b.weightKg} kg`,                                   66);
    row('Estado:',             b.status,                                            74);
    row('Empresa extractora:', company,                                             82);
    row('GPS de extracción:',  `${b.gpsLat.toFixed(4)}°S, ${b.gpsLon.toFixed(4)}°W`, 90);
    row('Fecha de emisión:',  issued,                                               98);
    row('TX Hash (origen):',   b.txHash,                                           106);

    doc.setDrawColor(220); doc.line(20, 112, 190, 112);

    // Custody chain
    doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(63, 129, 108);
    doc.text('CADENA DE CUSTODIA', 20, 121);

    let y = 130;
    this.events().forEach((ev, i) => {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(25, 25, 25);
      doc.text(`${i + 1}. ${ev.label}`, 22, y);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(80, 80, 80);
      doc.text(`Actor: ${ev.actor}`, 28, y + 5);
      doc.text(ev.detail, 28, y + 11);
      doc.text(`TX: ${ev.txHash}`, 28, y + 17);
      y += 24;
    });

    // QR code
    doc.setFontSize(8); doc.setTextColor(90); doc.setFont('helvetica', 'bold');
    doc.text('Código QR de verificación', 148, 228);
    if (qrDataUrl) doc.addImage(qrDataUrl, 'PNG', 148, 230, 38, 38);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(120);
    doc.text('opaltrace.com/verify', 148, 271);

    // Footer
    doc.setFontSize(7.5); doc.setTextColor(150);
    doc.text('Certificado emitido por OpalTrace. Trazabilidad verificable en blockchain.', 20, 280);
    doc.text(`Generado el ${new Date().toLocaleDateString('es-PE')}`, 20, 285);

    doc.save(`${certId}.pdf`);
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