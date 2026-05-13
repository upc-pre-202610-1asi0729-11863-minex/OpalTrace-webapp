import { BaseResource } from '../../shared/infrastructure/base-response';

export interface SubLotResource extends BaseResource {
  id: number;
  sublotId: string;
  parentBatchId: string;
  weightKg: number;
  status: string;
}

export interface SubLotsResponse {
  sublots: SubLotResource[];
}