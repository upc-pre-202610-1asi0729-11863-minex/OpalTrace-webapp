import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface BillingRecordResource extends BaseResource {
  id: number;
  userId: number;
  date: string;
  plan: string;
  amount: number;
  status: string;
}

export interface BillingRecordsResponse extends BaseResponse {
  billingRecords?: BillingRecordResource[];
}
