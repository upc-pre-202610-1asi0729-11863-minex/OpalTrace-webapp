import { BaseResource } from '../../shared/infrastructure/base-response';

export interface MineralBatchResource extends BaseResource {
  id: number;
  batchId: string;
  mineral: string;
  weightKg: number;
  status: string;
  isBlocked: boolean;
  gpsLat: number;
  gpsLon: number;
  timestamp: string;
  txHash: string;
  userId: number;
  anomalyReason?: string | null;
}

export interface MineralBatchesResponse {
  batches: MineralBatchResource[];
}
