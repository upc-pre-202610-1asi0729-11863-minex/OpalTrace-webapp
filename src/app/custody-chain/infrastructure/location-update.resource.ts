import { BaseResource } from '../../shared/infrastructure/base-response';

export interface LocationUpdateResource extends BaseResource {
  id: number;
  batchId: string;
  lat: number;
  lon: number;
  timestamp: string;
  actor: string;
}

export interface LocationUpdatesResponse {
  locationUpdates: LocationUpdateResource[];
}