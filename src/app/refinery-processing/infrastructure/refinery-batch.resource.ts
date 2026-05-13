import { BaseResource } from '../../shared/infrastructure/base-response';

export interface RefineryBatchResource extends BaseResource {
  id: number;
  batchId: string;
  weightKg: number;
  status: string;
  receivedAt: string;
  location: string;
  mineral: string | null;
}

export interface RefineryBatchesResponse {
  refineryBatches: RefineryBatchResource[];
}
