import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { CertState, TraceabilityEvent } from '../domain/model/jewelry-product.entity';

export interface JewelryProductResource extends BaseResource {
  id: number;
  productId: string;
  name: string;
  weightG: number;
  batchId: string | null;
  certId: string | null;
  isCertifiedSource: boolean;
  certState: CertState;
  isBlocked: boolean;
  supplier: string | null;
  events?: TraceabilityEvent[];
}

export interface JewelryProductsResponse extends BaseResponse {
  products: JewelryProductResource[];
}
