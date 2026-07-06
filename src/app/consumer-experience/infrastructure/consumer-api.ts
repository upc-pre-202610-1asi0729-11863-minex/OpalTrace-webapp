import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { ConsumerCertificate } from '../domain/model/consumer-certificate.entity';
import { VerificationEvent } from '../domain/model/verification-event.entity';
import { ConsumerCertificatesApiEndpoint } from './consumer-certificates-api-endpoint';
import { VerificationEventsApiEndpoint } from './verification-events-api-endpoint';

@Injectable({ providedIn: 'root' })
export class ConsumerApi extends BaseApi {
  private readonly certificatesEndpoint: ConsumerCertificatesApiEndpoint;
  private readonly verificationEventsEndpoint: VerificationEventsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.certificatesEndpoint = new ConsumerCertificatesApiEndpoint(http);
    this.verificationEventsEndpoint = new VerificationEventsApiEndpoint(http);
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
}
