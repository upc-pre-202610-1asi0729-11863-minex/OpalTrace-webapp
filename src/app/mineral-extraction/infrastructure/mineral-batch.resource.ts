import { BaseResource } from '../../shared/infrastructure/base-response';

/** Mirrors the backend MineralBatchResource returned by /mineral-batches. */
export interface MineralBatchResource extends BaseResource {
  id: number;
  batchId: string;
  mineralType: string;
  weightKg: number;
  originLatitude: number;
  originLongitude: number;
  status: string;
  blocked: boolean;
  supervisorId: number | null;
  miningCompanyId: number | null;
  blockchainTxHash: string | null;
  parentBatchId: number | null;
  qrCodeData: string | null;
}

export interface MineralBatchesResponse {
  batches: MineralBatchResource[];
}
