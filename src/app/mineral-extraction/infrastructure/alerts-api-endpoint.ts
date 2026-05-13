import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { AnomalyAlert } from '../domain/model/anomaly-alert.entity';
import { AnomalyAlertResource, AnomalyAlertsResponse } from './anomaly-alert.resource';
import { AnomalyAlertAssembler } from './anomaly-alert.assembler';
import { environment } from '../../../environments/environment';

export class AlertsApiEndpoint extends BaseApiEndpoint<
  AnomalyAlert,
  AnomalyAlertResource,
  AnomalyAlertsResponse,
  AnomalyAlertAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderAlertsEndpointPath}`,
      new AnomalyAlertAssembler()
    );
  }

  getByUserId(userId: number): Observable<AnomalyAlert[]> {
    return this.http.get<AnomalyAlertResource[]>(`${this.endpointUrl}?userId=${userId}`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch alerts by userId'))
    );
  }
}
