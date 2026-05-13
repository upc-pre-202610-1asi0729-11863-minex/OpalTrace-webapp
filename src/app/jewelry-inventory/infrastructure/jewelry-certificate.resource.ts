import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface JewelryCertificateResource extends BaseResource {
  id: number;
  certId: string;
  productName: string;
  certState: 'CERTIFIED' | 'REVOKED';
  signatureValid: boolean;
  batchId: string | null;
  issuedAt: string;
  jewelerName: string | null;
}

export interface JewelryCertificatesResponse extends BaseResponse {
  certificates: JewelryCertificateResource[];
}
