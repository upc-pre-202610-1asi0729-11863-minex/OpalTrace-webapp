import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { RefineryBatch, RefineryBatchStatus } from '../domain/model/refinery-batch.entity';
import { RefineryBatchResource, RefineryBatchesResponse } from './refinery-batch.resource';

export class RefineryBatchAssembler implements BaseAssembler<RefineryBatch, RefineryBatchResource, RefineryBatchesResponse> {
  toEntitiesFromResponse(response: RefineryBatchesResponse): RefineryBatch[] {
    return response.refineryBatches.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: RefineryBatchResource): RefineryBatch {
    return new RefineryBatch({
      id: resource.id,
      batchId: resource.batchId,
      weightKg: resource.weightKg,
      status: resource.status as RefineryBatchStatus,
      receivedAt: resource.receivedAt,
      location: resource.location,
      mineral: resource.mineral,
    });
  }

  toResourceFromEntity(entity: RefineryBatch): RefineryBatchResource {
    return {
      id: entity.id,
      batchId: entity.batchId,
      weightKg: entity.weightKg,
      status: entity.status,
      receivedAt: entity.receivedAt,
      location: entity.location,
      mineral: entity.mineral,
    };
  }
}
