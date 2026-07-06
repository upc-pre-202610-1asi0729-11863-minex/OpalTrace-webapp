import { Component, inject, signal, computed, effect, ElementRef, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import * as L from 'leaflet';
import { CustodyStore } from '../../../application/custody.store';
import { LocationUpdateRecord as GpsPoint } from '../../../domain/model/location-update.entity';
import { MineralStore, BatchStatus } from '../../../../mineral-extraction/application/mineral.store';

interface UpdateResult {
  success: boolean;
  error?: string;
}

interface DeviceReading {
  lat: number;
  lon: number;
  accuracy: number;
  time: string;
}

/**
 * Location Update view.
 * Route: /custody/location
 * Shows status flow, GPS map placeholder, delay warning, and GPS update form.
 */
@Component({
  selector: 'app-location-update',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './location-update.html',
})
export class LocationUpdate implements OnInit, AfterViewInit, OnDestroy {
  private custodyStore = inject(CustodyStore);
  private mineralStore = inject(MineralStore);
  private translate    = inject(TranslateService);

  @ViewChild('mapEl') mapEl?: ElementRef<HTMLDivElement>;
  private map?: L.Map;
  private routeLayer?: L.LayerGroup;

  constructor() {
    // Redraw the route whenever a new GPS point is registered for the batch.
    effect(() => {
      const points = this.gpsPoints();
      if (this.map) this.renderRoute(points);
    });
  }

  /** Form fields */
  selectedBatchId = '';
  latInput: number | null = null;
  lonInput: number | null = null;
  result = signal<UpdateResult | null>(null);

  /** IoT GPS device (browser Geolocation acts as the batch tracker) */
  deviceActive = signal(false);
  deviceError  = signal<string | null>(null);
  lastReading  = signal<DeviceReading | null>(null);
  readingCount = signal(0);
  private watchId: number | null = null;
  private lastPosted: string | null = null;

  ngOnInit(): void {
    const first = this.transitBatches()[0];
    if (first) this.selectedBatchId = first.batchId;
  }

  ngAfterViewInit(): void {
    if (!this.mapEl) return;
    // Peru-centered default view until the first reading arrives.
    this.map = L.map(this.mapEl.nativeElement, { attributionControl: true })
      .setView([-12.0464, -77.0428], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);
    this.routeLayer = L.layerGroup().addTo(this.map);
    // Ensure correct sizing once the container is laid out.
    setTimeout(() => {
      this.map?.invalidateSize();
      this.renderRoute(this.gpsPoints());
    }, 150);
  }

  ngOnDestroy(): void {
    this.stopDevice();
    this.map?.remove();
  }

  private renderRoute(points: GpsPoint[]): void {
    if (!this.map || !this.routeLayer) return;
    this.routeLayer.clearLayers();
    if (points.length === 0) return;

    const sorted = [...points].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const latlngs = sorted.map(p => [p.lat, p.lon] as L.LatLngTuple);

    L.polyline(latlngs, { color: '#3F816C', weight: 3, opacity: 0.8 }).addTo(this.routeLayer);

    sorted.forEach((p, i) => {
      const isLast = i === sorted.length - 1;
      L.circleMarker([p.lat, p.lon], {
        radius: isLast ? 8 : 5,
        color: '#fff',
        weight: 2,
        fillColor: isLast ? '#e8a020' : '#3F816C',
        fillOpacity: 1,
      })
        .bindPopup(`${this.formatCoords(p)}<br>${this.formatTime(p.timestamp)}`)
        .addTo(this.routeLayer!);
    });

    this.map.fitBounds(L.latLngBounds(latlngs).pad(0.3), { maxZoom: 14 });
  }

  startDevice(): void {
    this.deviceError.set(null);
    if (!this.selectedBatchId) {
      this.deviceError.set(this.translate.instant('custody.iot-no-batch'));
      return;
    }
    if (!('geolocation' in navigator)) {
      this.deviceError.set(this.translate.instant('custody.iot-unsupported'));
      return;
    }
    this.deviceActive.set(true);
    this.watchId = navigator.geolocation.watchPosition(
      pos => this.onDeviceReading(pos),
      () => {
        this.deviceError.set(this.translate.instant('custody.iot-denied'));
        this.stopDevice();
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  }

  stopDevice(): void {
    if (this.watchId != null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.deviceActive.set(false);
  }

  private onDeviceReading(pos: GeolocationPosition): void {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    this.lastReading.set({
      lat, lon,
      accuracy: Math.round(pos.coords.accuracy),
      time: new Date().toISOString(),
    });

    // Skip stationary duplicates so each emitted event is a real movement.
    const fingerprint = `${lat.toFixed(5)},${lon.toFixed(5)}`;
    if (fingerprint === this.lastPosted) return;
    this.lastPosted = fingerprint;

    this.custodyStore.updateLocation(this.selectedBatchId, lat, lon).then(outcome => {
      if ('errorKey' in outcome) {
        this.deviceError.set(this.translate.instant(outcome.errorKey, outcome.errorParams));
      } else {
        this.readingCount.update(n => n + 1);
      }
    });
  }

  readonly statusSteps: BatchStatus[] = ['En Origen', 'En Tránsito', 'En Planta', 'Certificado'];

  /** Batches currently in transit */
  readonly transitBatches = computed(() =>
    this.mineralStore.batches().filter(b => b.status === 'En Tránsito')
  );

  /** GPS points for the selected batch */
  readonly gpsPoints = computed(() =>
    this.custodyStore.getLocationsForBatch(this.selectedBatchId)
  );

  /** Current status for the selected batch */
  readonly currentStatus = computed((): BatchStatus => {
    const batch = this.mineralStore.batches().find(b => b.batchId === this.selectedBatchId);
    return (batch?.status ?? 'En Tránsito') as BatchStatus;
  });

  /** True if the selected batch has a delayed transport */
  readonly isDelayed = computed(() =>
    this.custodyStore.isDelayed(this.selectedBatchId)
  );

  stepClass(step: BatchStatus): string {
    const order: Record<BatchStatus, number> = {
      'En Origen': 0,
      'En Tránsito': 1,
      'En Planta': 2,
      'Certificado': 3,
    };
    const current = order[this.currentStatus()];
    const stepIdx  = order[step];
    if (stepIdx < current)  return 'status-step done';
    if (stepIdx === current) return 'status-step active';
    return 'status-step';
  }

  onSubmit(): void {
    if (this.latInput == null || this.lonInput == null) {
      this.result.set({ success: false, error: this.translate.instant('custody.err-latlon-required') });
      return;
    }
    if (this.latInput < -90 || this.latInput > 90) {
      this.result.set({ success: false, error: this.translate.instant('custody.err-lat-range') });
      return;
    }
    if (this.lonInput < -180 || this.lonInput > 180) {
      this.result.set({ success: false, error: this.translate.instant('custody.err-lon-range') });
      return;
    }

    this.custodyStore.updateLocation(
      this.selectedBatchId,
      this.latInput,
      this.lonInput
    ).then(outcome => {
      if ('errorKey' in outcome) {
        this.result.set({ success: false, error: this.translate.instant(outcome.errorKey, outcome.errorParams) });
      } else {
        this.result.set({ success: true });
        this.latInput = null;
        this.lonInput = null;
      }
    });
  }

  onReset(): void {
    this.result.set(null);
    this.latInput = null;
    this.lonInput = null;
  }

  formatCoords(point: GpsPoint): string {
    return `${point.lat.toFixed(4)}, ${point.lon.toFixed(4)}`;
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleString('es-PE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }
}
