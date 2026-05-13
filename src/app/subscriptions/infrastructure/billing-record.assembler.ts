import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BillingRecord } from '../domain/model/billing-record.entity';
import { BillingRecordResource, BillingRecordsResponse } from './billing-record.resource';

export class BillingRecordAssembler
  implements BaseAssembler<BillingRecord, BillingRecordResource, BillingRecordsResponse> {

  toEntityFromResource(resource: BillingRecordResource): BillingRecord {
    return new BillingRecord({
      id: resource.id,
      userId: resource.userId,
      date: resource.date,
      plan: resource.plan,
      amount: resource.amount,
      status: resource.status,
    });
  }

  toResourceFromEntity(entity: BillingRecord): BillingRecordResource {
    return {
      id: entity.id,
      userId: entity.userId,
      date: entity.date,
      plan: entity.plan,
      amount: entity.amount,
      status: entity.status,
    };
  }

  toEntitiesFromResponse(response: BillingRecordsResponse): BillingRecord[] {
    if (response.billingRecords) {
      return response.billingRecords.map(r => this.toEntityFromResource(r));
    }
    return [];
  }
}
