import { Component, inject, signal, computed, effect, ElementRef, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import * as L from 'leaflet';
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
export class VerifyMap implements OnInit, AfterViewInit, OnDestroy {
  private store = inject(ConsumerStore);
  private route = inject(ActivatedRoute);

  certificateId = signal<string>('');
  points        = signal<GeoPoint[]>([]);

  @ViewChild('mapEl') mapEl?: ElementRef<HTMLDivElement>;
  private map?: L.Map;
  private routeLayer?: L.LayerGroup;

  readonly markers = computed<TimelineMarker[]>(() =>
    this.points().map(p => ({
      point: p,
      icon:      this.iconFor(p.eventType),
      dotClass:  this.dotFor(p.eventType),
      label:     this.labelFor(p.eventType),
    }))
  );

  constructor() {
    effect(() => {
      const pts = this.points();
      if (this.map) this.renderRoute(pts);
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('certificateId') ?? '';
    this.certificateId.set(id);
    this.store.getTraceabilityPoints(id).subscribe(pts => this.points.set(pts));
    this.store.registerVerificationEvent(id);
  }

  ngAfterViewInit(): void {
    if (!this.mapEl) return;
    this.map = L.map(this.mapEl.nativeElement).setView([-12.0464, -77.0428], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);
    this.routeLayer = L.layerGroup().addTo(this.map);
    setTimeout(() => {
      this.map?.invalidateSize();
      this.renderRoute(this.points());
    }, 150);
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private renderRoute(points: GeoPoint[]): void {
    if (!this.map || !this.routeLayer) return;
    this.routeLayer.clearLayers();
    if (points.length === 0) return;

    const sorted = [...points].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const latlngs = sorted.map(p => [p.lat, p.lon] as L.LatLngTuple);

    L.polyline(latlngs, { color: '#3F816C', weight: 3, opacity: 0.7, dashArray: '6 6' }).addTo(this.routeLayer);

    sorted.forEach(p => {
      L.circleMarker([p.lat, p.lon], {
        radius: 7,
        color: '#fff',
        weight: 2,
        fillColor: this.colorFor(p.eventType),
        fillOpacity: 1,
      })
        .bindPopup(`<strong>${this.labelFor(p.eventType)}</strong>${p.actor ? '<br>' + p.actor : ''}`)
        .addTo(this.routeLayer!);
    });

    this.map.fitBounds(L.latLngBounds(latlngs).pad(0.3), { maxZoom: 12 });
  }

  private colorFor(eventType: string): string {
    const map: Record<string, string> = {
      MineralExtracted:  '#3F816C',
      TransportStarted:  '#2f6fb0',
      LocationUpdated:   '#2f6fb0',
      BatchReceived:     '#e8a020',
      CertificateIssued: '#7b5ea7',
    };
    return map[eventType] ?? '#3F816C';
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
