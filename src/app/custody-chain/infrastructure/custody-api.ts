import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { LocationUpdateRecord } from '../domain/model/location-update.entity';
import { LocationUpdatesApiEndpoint } from './location-updates-api-endpoint';

@Injectable({ providedIn: 'root' })
export class CustodyApi extends BaseApi {
  private readonly locationUpdatesEndpoint: LocationUpdatesApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.locationUpdatesEndpoint = new LocationUpdatesApiEndpoint(http);
  }

  getLocationUpdates(): Observable<LocationUpdateRecord[]> {
    return this.locationUpdatesEndpoint.getAll();
  }

  createLocationUpdate(record: LocationUpdateRecord): Observable<LocationUpdateRecord> {
    return this.locationUpdatesEndpoint.create(record);
  }
}