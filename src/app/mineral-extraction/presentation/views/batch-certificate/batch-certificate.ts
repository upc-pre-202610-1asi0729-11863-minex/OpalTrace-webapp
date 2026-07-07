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

  downloadPdf(): void {
    const b = this.batch();
    if (!b) return;
    const doc = new jsPDF();
    const company = this.companyName();
    const certId  = `ORIG-${b.batchId}`;
    const issued  = new Date(b.timestamp).toLocaleDateString('es-PE');

    doc.setFontSize(22);
    doc.setTextColor(63, 129, 108);
    doc.text('OpalTrace', 20, 22);
    doc.setFontSize(13);
    doc.setTextColor(40, 40, 40);
    doc.text('CERTIFICADO DE ORIGEN MINERAL', 20, 31);
    doc.setDrawColor(63, 129, 108);
    doc.setLineWidth(0.7);
    doc.line(20, 35, 190, 35);

    const row = (label: string, value: string, y: number) => {
      doc.setFont('helvetica', 'bold');   doc.setFontSize(10); doc.setTextColor(80, 80, 80);
      doc.text(label, 22, y);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(30, 30, 30);
      doc.text(value, 80, y);
    };

    row('Nº Certificado:',   certId,                     45);
    row('ID de Lote:',        b.batchId,                  53);
    row('Mineral:',           b.mineral,                  61);
    row('Peso registrado:',  `${b.weightKg} kg`,          69);
    row('Estado:',            b.status,                   77);
    row('Empresa extractora:', company,                   85);
    row('GPS de extracción:', `${b.gpsLat.toFixed(4)}°S, ${b.gpsLon.toFixed(4)}°W`, 93);
    row('Fecha de registro:', issued,                    101);
    row('TX Hash:',           b.txHash,                  109);

    doc.setDrawColor(220, 220, 220);
    doc.line(20, 116, 190, 116);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(63, 129, 108);
    doc.text('CADENA DE CUSTODIA', 20, 126);

    let y = 136;
    this.events().forEach((ev, i) => {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(30, 30, 30);
      doc.text(`${i + 1}. ${ev.label}`, 22, y);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(80, 80, 80);
      doc.text(`Actor: ${ev.actor}`, 28, y + 6);
      doc.text(ev.detail, 28, y + 12);
      doc.text(`TX: ${ev.txHash}`, 28, y + 18);
      y += 26;
    });

    doc.setFontSize(8); doc.setTextColor(150);
    doc.text('Certificado emitido por OpalTrace. Documento de trazabilidad con validez verificable en blockchain.', 20, 278);
    doc.text(`Generado el ${new Date().toLocaleDateString('es-PE')}`, 20, 283);

    doc.save(`${certId}.pdf`);
  }
}