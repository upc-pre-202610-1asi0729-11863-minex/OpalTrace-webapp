import { HttpClient } from '@angular/common/http';
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
}