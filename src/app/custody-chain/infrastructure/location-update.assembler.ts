import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { LocationUpdateRecord } from '../domain/model/location-update.entity';
import { LocationUpdateResource, LocationUpdatesResponse } from './location-update.resource';

export class LocationUpdateAssembler implements BaseAssembler<LocationUpdateRecord, LocationUpdateResource, LocationUpdatesResponse> {
  toEntitiesFromResponse(response: LocationUpdatesResponse): LocationUpdateRecord[] {
    return response.locationUpdates.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: LocationUpdateResource): LocationUpdateRecord {
    return new LocationUpdateRecord({
      id: resource.id,
      batchId: resource.batchId,
      lat: resource.lat,
      lon: resource.lon,
      timestamp: resource.timestamp,
      actor: resource.actor,
    });
  }

  toResourceFromEntity(entity: LocationUpdateRecord): LocationUpdateResource {
    return {
      id: entity.id,
      batchId: entity.batchId,
      lat: entity.lat,
      lon: entity.lon,
      timestamp: entity.timestamp,
      actor: entity.actor,
    };
  }
}