import { BaseResource } from '../../shared/infrastructure/base-response';

export interface ShrinkageRecordResource extends BaseResource {
  id: number;
  batchId: string;
  percentage: number;
  type: string;
  timestamp: string;
}

export interface ShrinkageRecordsResponse {
  shrinkageRecords: ShrinkageRecordResource[];
}
