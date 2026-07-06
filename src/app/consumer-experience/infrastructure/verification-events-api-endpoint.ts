import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { VerificationEvent } from '../domain/model/verification-event.entity';
import { VerificationEventResource, VerificationEventsResponse } from './verification-event.resource';
import { VerificationEventAssembler } from './verification-event.assembler';
import { environment } from '../../../environments/environment';

export class VerificationEventsApiEndpoint extends BaseApiEndpoint<
  VerificationEvent,
  VerificationEventResource,
  VerificationEventsResponse,
  VerificationEventAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderVerificationEventsEndpointPath}`,
      new VerificationEventAssembler()
    );
  }

  verify(certificateId: string, event: VerificationEvent): Observable<VerificationEvent> {
    const resource = this.assembler.toResourceFromEntity(event);
    return this.http.post<VerificationEventResource>(`${this.endpointUrl}/${certificateId}/verify`, resource).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to verify certificate'))
    );
  }

  verifyProduct(certificateId: string): Observable<any> {
    return this.http.post<any>(`${this.endpointUrl}/${certificateId}/verify`, {}).pipe(
      catchError(this.handleError('Failed to verify product'))
    );
  }

  getTraceabilityMap(certificateId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.endpointUrl}/${certificateId}/traceability-map`).pipe(
      catchError(this.handleError('Failed to get traceability map'))
    );
  }
}
