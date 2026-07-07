import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { ConsumerCertificate } from '../domain/model/consumer-certificate.entity';
import { VerificationEvent } from '../domain/model/verification-event.entity';
import { ConsumerCertificatesApiEndpoint } from './consumer-certificates-api-endpoint';
import { VerificationEventsApiEndpoint } from './verification-events-api-endpoint';
import { environment } from '../../../environments/environment';

interface HistoryItemResource {
  certId: string;
  productName: string;
  verifiedAt: string;
  result: string;
}

interface MyJewelryItemResource {
  certId: string;
  productName: string;
  jewelerName: string | null;
  certificationState: string;
  verifiedAt: string;
}

interface VerificationLogEntry {
  certId: string;
  productName: string;
  verifiedAt: string;
  authentic: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConsumerApi extends BaseApi {
  private readonly certificatesEndpoint: ConsumerCertificatesApiEndpoint;
  private readonly verificationEventsEndpoint: VerificationEventsApiEndpoint;
  private readonly consumerBaseUrl: string;

  constructor(private readonly http: HttpClient) {
    super();
    this.certificatesEndpoint = new ConsumerCertificatesApiEndpoint(http);
    this.verificationEventsEndpoint = new VerificationEventsApiEndpoint(http);
    this.consumerBaseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderConsumerEndpointPath}`;
  }

  getCertificates(): Observable<ConsumerCertificate[]> {
    return this.certificatesEndpoint.getAll();
  }

  verify(certificateId: string, event: VerificationEvent): Observable<VerificationEvent> {
    return this.verificationEventsEndpoint.verify(certificateId, event);
  }

  verifyProduct(certificateId: string): Observable<any> {
    return this.verificationEventsEndpoint.verifyProduct(certificateId);
  }

  getTraceabilityMap(certificateId: string): Observable<any[]> {
    return this.verificationEventsEndpoint.getTraceabilityMap(certificateId);
  }

  getVerificationHistory(): Observable<VerificationLogEntry[]> {
    return this.http.get<HistoryItemResource[]>(`${this.consumerBaseUrl}/history`).pipe(
      map(items => items.map(i => ({
        certId:      i.certId,
        productName: i.productName,
        verifiedAt:  i.verifiedAt,
        authentic:   i.result === 'AUTHENTIC',
      }))),
      catchError(() => of([] as VerificationLogEntry[]))
    );
  }

  getMyJewelry(): Observable<ConsumerCertificate[]> {
    return this.http.get<MyJewelryItemResource[]>(`${this.consumerBaseUrl}/my-jewelry`).pipe(
      map(items => items.map(i => new ConsumerCertificate({
        id:            0,
        certId:        i.certId,
        productName:   i.productName,
        certState:     'CERTIFIED',
        signatureValid: true,
        batchId:       null,
        issuedAt:      i.verifiedAt,
        jewelerName:   i.jewelerName ?? null,
      }))),
      catchError(() => of([] as ConsumerCertificate[]))
    );
  }
}
