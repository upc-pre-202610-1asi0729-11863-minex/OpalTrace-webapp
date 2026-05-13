import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { ShrinkageRecord, ShrinkageType } from '../domain/model/shrinkage-record.entity';
import { ShrinkageRecordResource, ShrinkageRecordsResponse } from './shrinkage-record.resource';

export class ShrinkageRecordAssembler implements BaseAssembler<ShrinkageRecord, ShrinkageRecordResource, ShrinkageRecordsResponse> {
  toEntitiesFromResponse(response: ShrinkageRecordsResponse): ShrinkageRecord[] {
    return response.shrinkageRecords.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: ShrinkageRecordResource): ShrinkageRecord {
    return new ShrinkageRecord({
      id: resource.id,
      batchId: resource.batchId,
      percentage: resource.percentage,
      type: resource.type as ShrinkageType,
      timestamp: resource.timestamp,
    });
  }

  toResourceFromEntity(entity: ShrinkageRecord): ShrinkageRecordResource {
    return {
      id: entity.id,
      batchId: entity.batchId,
      percentage: entity.percentage,
      type: entity.type,
      timestamp: entity.timestamp,
    };
  }
}
