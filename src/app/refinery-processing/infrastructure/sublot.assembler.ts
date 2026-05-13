import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { SubLot, SubLotStatus } from '../domain/model/sublot.entity';
import { SubLotResource, SubLotsResponse } from './sublot.resource';

export class SubLotAssembler implements BaseAssembler<SubLot, SubLotResource, SubLotsResponse> {
  toEntitiesFromResponse(response: SubLotsResponse): SubLot[] {
    return response.sublots.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: SubLotResource): SubLot {
    return new SubLot({
      id: resource.id,
      sublotId: resource.sublotId,
      parentBatchId: resource.parentBatchId,
      weightKg: resource.weightKg,
      status: resource.status as SubLotStatus,
    });
  }

  toResourceFromEntity(entity: SubLot): SubLotResource {
    return {
      id: entity.id,
      sublotId: entity.sublotId,
      parentBatchId: entity.parentBatchId,
      weightKg: entity.weightKg,
      status: entity.status,
    };
  }
}
