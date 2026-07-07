import { Injectable, inject, signal } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { ConsumerApi } from '../infrastructure/consumer-api';
import { ConsumerCertificate } from '../domain/model/consumer-certificate.entity';
import { VerificationEvent } from '../domain/model/verification-event.entity';

export interface GeoPoint {
  lat: number;
  lon: number;
  eventType: string;
  timestamp: string;
  actor?: string;
  txHash?: string;
}

export interface VerificationLogEntry {
  certId: string;
  productName: string;
  verifiedAt: string;
  authentic: boolean;
}

export interface VerifyResult {
  authentic: boolean;
  cert?: {
    certId: string;
    productName: string;
    certState: string;
    issuedAt: string;
    batchId: string | null;
    events: Array<{ type: string; timestamp: string; actor: string; txHash?: string }>;
  };
  /** i18n key + params emitted by the store; the view resolves them into `error`. */
  errorKey?: string;
  errorParams?: Record<string, string>;
  /** Human-readable message resolved in the presentation layer. */
  error?: string;
}

const MOCK_CERTIFICATES: ConsumerCertificate[] = [
  new ConsumerCertificate({ id: 1, certId: 'CERT-2025-001', productName: 'Anillo de compromiso — Oro 18K',  certState: 'CERTIFIED', signatureValid: true,  batchId: 'OT-2025-0001', issuedAt: '2025-03-15T14:00:00Z', jewelerName: 'Joyería Elegant S.A.C.' }),
  new ConsumerCertificate({ id: 2, certId: 'CERT-2025-002', productName: 'Collar de plata — Diseño andino', certState: 'CERTIFIED', signatureValid: true,  batchId: 'OT-2025-0002', issuedAt: '2025-03-21T11:00:00Z', jewelerName: 'Joyería Elegant S.A.C.' }),
  new ConsumerCertificate({ id: 3, certId: 'CERT-2025-003', productName: 'Brazalete — Oro 18K trenzado',    certState: 'CERTIFIED', signatureValid: true,  batchId: 'OT-2025-0005', issuedAt: '2025-04-10T16:00:00Z', jewelerName: 'Artesanías del Sur E.I.R.L.' }),
  new ConsumerCertificate({ id: 4, certId: 'CERT-2025-004', productName: 'Anillo sello — Plata 950',        certState: 'REVOKED',   signatureValid: false, batchId: 'OT-2025-0003', issuedAt: '2025-03-25T09:00:00Z', jewelerName: 'Joyería del Pacífico S.A.C.' }),
  new ConsumerCertificate({ id: 5, certId: 'CERT-2025-005', productName: 'Dije — Oro 18K Cruz andina',      certState: 'CERTIFIED', signatureValid: true,  batchId: 'OT-2025-0001', issuedAt: '2025-04-02T09:00:00Z', jewelerName: 'Joyería Elegant S.A.C.' }),
];

const MOCK_GEO_POINTS: Record<string, GeoPoint[]> = {
  'CERT-2025-001': [
    { lat: -13.5328, lon: -72.4442, eventType: 'MineralExtracted',  timestamp: '2025-03-10T08:00:00Z', actor: 'GeoMiner S.A.C.',              txHash: '0xabc1230001' },
    { lat: -13.6012, lon: -72.5110, eventType: 'TransportStarted',  timestamp: '2025-03-11T10:00:00Z', actor: 'Logística Sur E.I.R.L.',        txHash: '0xabc1230011' },
    { lat: -13.5800, lon: -72.4800, eventType: 'LocationUpdated',   timestamp: '2025-03-12T14:00:00Z', actor: 'Logística Sur E.I.R.L.',        txHash: '0xabc1230021' },
    { lat: -12.0800, lon: -77.0500, eventType: 'BatchReceived',     timestamp: '2025-03-13T09:00:00Z', actor: 'Refinería Lima S.A.',            txHash: '0xabc1230031' },
    { lat: -12.0464, lon: -77.0300, eventType: 'CertificateIssued', timestamp: '2025-03-15T14:00:00Z', actor: 'Joyería Elegant S.A.C.',         txHash: '0xabc1230041' },
  ],
  'CERT-2025-002': [
    { lat: -13.5000, lon: -72.4000, eventType: 'MineralExtracted',  timestamp: '2025-03-12T08:00:00Z', actor: 'GeoMiner S.A.C.',              txHash: '0xabc1230002' },
    { lat: -13.6200, lon: -72.5200, eventType: 'TransportStarted',  timestamp: '2025-03-14T10:00:00Z', actor: 'Logística Sur E.I.R.L.',        txHash: '0xabc1230012' },
    { lat: -12.0900, lon: -77.0600, eventType: 'BatchReceived',     timestamp: '2025-03-16T09:00:00Z', actor: 'Refinería Lima S.A.',            txHash: '0xabc1230022' },
    { lat: -12.0464, lon: -77.0300, eventType: 'CertificateIssued', timestamp: '2025-03-21T11:00:00Z', actor: 'Joyería Elegant S.A.C.',         txHash: '0xabc1230042' },
  ],
  'CERT-2025-003': [
    { lat: -13.5800, lon: -72.4800, eventType: 'MineralExtracted',  timestamp: '2025-03-20T08:00:00Z', actor: 'GeoMiner S.A.C.',              txHash: '0xabc1230005' },
    { lat: -13.6500, lon: -72.5500, eventType: 'TransportStarted',  timestamp: '2025-03-22T10:00:00Z', actor: 'Logística Sur E.I.R.L.',        txHash: '0xabc1230015' },
    { lat: -12.0700, lon: -77.0400, eventType: 'BatchReceived',     timestamp: '2025-04-01T09:00:00Z', actor: 'Refinería Lima S.A.',            txHash: '0xabc1230025' },
    { lat: -12.0464, lon: -77.0300, eventType: 'CertificateIssued', timestamp: '2025-04-10T16:00:00Z', actor: 'Artesanías del Sur E.I.R.L.',    txHash: '0xabc1230045' },
  ],
  'CERT-2025-004': [
    { lat: -13.7800, lon: -72.6230, eventType: 'MineralExtracted',  timestamp: '2025-03-18T08:00:00Z', actor: 'GeoMiner S.A.C.',              txHash: '0xabc1230003' },
    { lat: -13.8000, lon: -72.6500, eventType: 'TransportStarted',  timestamp: '2025-03-20T10:00:00Z', actor: 'Logística Sur E.I.R.L.',        txHash: '0xabc1230013' },
    { lat: -12.0600, lon: -77.0350, eventType: 'CertificateIssued', timestamp: '2025-03-25T09:00:00Z', actor: 'Joyería del Pacífico S.A.C.',    txHash: '0xabc1230043' },
  ],
  'CERT-2025-005': [
    { lat: -13.5800, lon: -72.4800, eventType: 'MineralExtracted',  timestamp: '2025-03-28T08:00:00Z', actor: 'GeoMiner S.A.C.',              txHash: '0xabc1230001' },
    { lat: -13.6000, lon: -72.5000, eventType: 'TransportStarted',  timestamp: '2025-03-30T10:00:00Z', actor: 'Logística Sur E.I.R.L.',        txHash: '0xabc1230051' },
    { lat: -12.0800, lon: -77.0500, eventType: 'BatchReceived',     timestamp: '2025-04-01T09:00:00Z', actor: 'Refinería Lima S.A.',            txHash: '0xabc1230061' },
    { lat: -12.0464, lon: -77.0300, eventType: 'CertificateIssued', timestamp: '2025-04-02T09:00:00Z', actor: 'Joyería Elegant S.A.C.',         txHash: '0xabc1230071' },
  ],
};

@Injectable({ providedIn: 'root' })
export class ConsumerStore {
  private readonly api = inject(ConsumerApi);

  private readonly certificatesSignal   = signal<ConsumerCertificate[]>([]);
  private readonly verificationLogSignal = signal<VerificationLogEntry[]>([]);
  private readonly loadingSignal         = signal<boolean>(false);
  private readonly errorSignal           = signal<string | null>(null);

  readonly certificates   = this.certificatesSignal.asReadonly();
  readonly verificationLog = this.verificationLogSignal.asReadonly();
  readonly loading         = this.loadingSignal.asReadonly();
  readonly error           = this.errorSignal.asReadonly();

  constructor() {
    this.certificatesSignal.set(MOCK_CERTIFICATES);
  }

  private readonly EVENT_LABELS: Record<string, string> = {
    MineralExtracted:  'Extracción Mineral',
    TransportStarted:  'Inicio de Transporte',
    LocationUpdated:   'Actualización GPS',
    BatchReceived:     'Recepción en Refinería',
    CertificateIssued: 'Certificado en Joyería',
  };

  verifyQr(certId: string): Observable<VerifyResult> {
    // Support both plain certId and URLs like https://opaltrace.com/verify/CERT-2025-001
    const raw = certId.trim();
    const urlMatch = raw.match(/\/verify\/([^/?#]+)/i);
    const id = (urlMatch ? urlMatch[1] : raw).toUpperCase();
    const mockCert = MOCK_CERTIFICATES.find(c => c.certId.toUpperCase() === id);

    return forkJoin({
      verification: this.api.verifyProduct(id),
      points:       this.api.getTraceabilityMap(id).pipe(catchError(() => of([] as any[]))),
    }).pipe(
      map(({ verification, points }) => {
        const geoPoints: GeoPoint[] = points.length > 0
          ? points.map((p: any) => ({
              lat:       p.latitude,
              lon:       p.longitude,
              eventType: p.eventType,
              timestamp: p.timestamp,
              actor:     p.actorName,
              txHash:    p.blockchainTxHash,
            }))
          : (MOCK_GEO_POINTS[id] ?? []);

        const events = geoPoints.map(p => ({
          type:      this.EVENT_LABELS[p.eventType] ?? p.eventType,
          timestamp: p.timestamp,
          actor:     p.actor ?? '—',
          txHash:    p.txHash,
        }));

        if (verification.result === 'NOT_VERIFIABLE') {
          if (mockCert) {
            return {
              authentic: true,
              cert: {
                certId: id, productName: mockCert.productName,
                certState: mockCert.certState, issuedAt: mockCert.issuedAt,
                batchId: mockCert.batchId, events,
              },
            } as VerifyResult;
          }
          const local = this.readLocalCert(id);
          if (local) {
            return {
              authentic: true,
              cert: {
                certId: id, productName: local.productName,
                certState: 'CERTIFIED', issuedAt: local.issuedAt,
                batchId: local.batchId ?? null,
                events: this.eventsFromPoints(local.points),
              },
            } as VerifyResult;
          }
          return {
            authentic: false,
            errorKey: 'verify.err-not-found',
            errorParams: { certId },
          } as VerifyResult;
        }

        return {
          authentic: true,
          cert: {
            certId:      id,
            productName: mockCert?.productName ?? id,
            certState:   'CERTIFIED',
            issuedAt:    mockCert?.issuedAt ?? verification.verifiedAt ?? new Date().toISOString(),
            batchId:     verification.batchId ?? mockCert?.batchId ?? null,
            events,
          },
        } as VerifyResult;
      }),
      catchError(() => of(this.verifyQrFallback(id)))
    );
  }

  private verifyQrFallback(id: string): VerifyResult {
    const cert = MOCK_CERTIFICATES.find(c => c.certId.toUpperCase() === id);
    if (cert) {
      const points = MOCK_GEO_POINTS[cert.certId] ?? [];
      const events = points.map(p => ({
        type: this.EVENT_LABELS[p.eventType] ?? p.eventType,
        timestamp: p.timestamp, actor: p.actor ?? '—', txHash: p.txHash,
      }));
      if (cert.certState === 'REVOKED')
        return { authentic: false, cert: { certId: cert.certId, productName: cert.productName, certState: cert.certState, issuedAt: cert.issuedAt, batchId: cert.batchId, events }, errorKey: 'verify.err-revoked' };
      return { authentic: true, cert: { certId: cert.certId, productName: cert.productName, certState: cert.certState, issuedAt: cert.issuedAt, batchId: cert.batchId, events } };
    }
    const local = this.readLocalCert(id);
    if (local) {
      return {
        authentic: true,
        cert: { certId: id, productName: local.productName, certState: 'CERTIFIED', issuedAt: local.issuedAt, batchId: local.batchId ?? null, events: this.eventsFromPoints(local.points) },
      };
    }
    return { authentic: false, errorKey: 'verify.err-not-found', errorParams: { certId: id } };
  }

  private readLocalCert(id: string): { productName: string; issuedAt: string; batchId: string | null; points?: any[] } | null {
    try {
      const registry = JSON.parse(localStorage.getItem('ot_certs') ?? '{}');
      return registry[id] ?? null;
    } catch {
      return null;
    }
  }

  private eventsFromPoints(points?: any[]): Array<{ type: string; timestamp: string; actor: string; txHash?: string }> {
    return (points ?? []).map(p => ({
      type:      this.EVENT_LABELS[p.eventType] ?? p.eventType,
      timestamp: p.timestamp,
      actor:     p.actorName ?? '—',
      txHash:    p.blockchainTxHash,
    }));
  }

  getTraceabilityPoints(certId: string): Observable<GeoPoint[]> {
    const id = certId.trim().toUpperCase();
    return this.api.getTraceabilityMap(id).pipe(
      map((items: any[]) => (items.length > 0 ? items : this.readLocalCert(id)?.points ?? []).map(p => ({
        lat:       p.latitude,
        lon:       p.longitude,
        eventType: p.eventType,
        timestamp: p.timestamp,
        actor:     p.actorName,
        txHash:    p.blockchainTxHash,
      }))),
      catchError(() => {
        const localPoints = this.readLocalCert(id)?.points;
        if (localPoints && localPoints.length > 0) {
          return of(localPoints.map(p => ({
            lat: p.latitude, lon: p.longitude, eventType: p.eventType,
            timestamp: p.timestamp, actor: p.actorName, txHash: p.blockchainTxHash,
          })));
        }
        return of(MOCK_GEO_POINTS[id] ?? []);
      })
    );
  }

  registerVerificationEvent(certId: string): void {
    const normalizedId = certId.trim().toUpperCase();
    const cert = this.certificatesSignal().find(
      c => c.certId.toUpperCase() === normalizedId
    );
    const local = cert ? null : this.readLocalCert(normalizedId);

    const authentic = cert
      ? cert.certState !== 'REVOKED' && cert.signatureValid
      : !!local;
    const entry: VerificationLogEntry = {
      certId,
      productName: cert?.productName ?? local?.productName ?? '—',
      verifiedAt: new Date().toISOString(),
      authentic,
    };

    const result: 'AUTHENTIC' | 'NOT_FOUND' | 'REVOKED' = cert
      ? cert.certState === 'REVOKED'
        ? 'REVOKED'
        : 'AUTHENTIC'
      : local
        ? 'AUTHENTIC'
        : 'NOT_FOUND';

    const event = new VerificationEvent({
      id: 0,
      certId,
      timestamp: entry.verifiedAt,
      result,
    });

    this.api.verify(certId, event).pipe(retry(2)).subscribe({
      next: () => this.verificationLogSignal.update(log => [entry, ...log]),
      error: () => this.verificationLogSignal.update(log => [entry, ...log]),
    });
  }

}
