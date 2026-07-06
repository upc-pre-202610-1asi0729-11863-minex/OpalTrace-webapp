import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ConsumerStore, GeoPoint } from '../../../application/consumer.store';

interface TimelineMarker {
  point: GeoPoint;
  icon: string;
  dotClass: string;
  label: string;
}

@Component({
  selector: 'app-verify-map',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './verify-map.html',
})
export class VerifyMap implements OnInit {
  private store = inject(ConsumerStore);
  private route = inject(ActivatedRoute);

  certificateId = signal<string>('');
  points        = signal<GeoPoint[]>([]);

  readonly markers = computed<TimelineMarker[]>(() =>
    this.points().map(p => ({
      point: p,
      icon:      this.iconFor(p.eventType),
      dotClass:  this.dotFor(p.eventType),
      label:     this.labelFor(p.eventType),
    }))
  );

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('certificateId') ?? '';
    this.certificateId.set(id);
    this.store.getTraceabilityPoints(id).subscribe(pts => this.points.set(pts));
    this.store.registerVerificationEvent(id);
  }

  private iconFor(eventType: string): string {
    const map: Record<string, string> = {
      MineralExtracted:  'ti-pickaxe',
      TransportStarted:  'ti-truck',
      LocationUpdated:   'ti-map-pin',
      BatchReceived:     'ti-building-factory',
      CertificateIssued: 'ti-diamond',
    };
    return map[eventType] ?? 'ti-circle';
  }

  private dotFor(eventType: string): string {
    const map: Record<string, string> = {
      MineralExtracted:  'green',
      TransportStarted:  'blue',
      LocationUpdated:   'blue',
      BatchReceived:     'amber',
      CertificateIssued: 'purple',
    };
    return map[eventType] ?? 'blue';
  }

  private labelFor(eventType: string): string {
    const map: Record<string, string> = {
      MineralExtracted:  'Extracción Mineral',
      TransportStarted:  'Inicio de Transporte',
      LocationUpdated:   'Actualización GPS',
      BatchReceived:     'Recepción en Refinería',
      CertificateIssued: 'Certificado en Joyería',
    };
    return map[eventType] ?? eventType;
  }
}
