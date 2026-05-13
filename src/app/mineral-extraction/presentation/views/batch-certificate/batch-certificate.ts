import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MineralStore } from '../../../application/mineral.store';

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
  private store = inject(MineralStore);
  private route = inject(ActivatedRoute);
  readonly router = inject(Router);

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
        actor: 'Minera Andina S.A.C.',
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
}