import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { LocationUpdateRecord } from '../domain/model/location-update.entity';
import { LocationUpdateResource, LocationUpdatesResponse } from './location-update.resource';
import { LocationUpdateAssembler } from './location-update.assembler';
import { environment } from '../../../environments/environment';

export class LocationUpdatesApiEndpoint extends BaseApiEndpoint<
  LocationUpdateRecord,
  LocationUpdateResource,
  LocationUpdatesResponse,
  LocationUpdateAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderLocationUpdatesEndpointPath}`,
      new LocationUpdateAssembler()
    );
  }

  getLocationHistory(batchPk: number): Observable<LocationUpdateRecord[]> {
    return this.http.get<LocationUpdateResource[]>(`${this.endpointUrl}/${batchPk}/custody/location-history`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch location history'))
    );
  }

  createLocationUpdate(batchPk: number, record: LocationUpdateRecord): Observable<LocationUpdateRecord> {
    const resource = this.assembler.toResourceFromEntity(record);
    return this.http.post<LocationUpdateResource>(`${this.endpointUrl}/${batchPk}/custody/location`, resource).pipe(
      map(r => this.assembler.toEntityFromResource(r)),
      catchError(this.handleError('Failed to create location update'))
    );
  }
}
