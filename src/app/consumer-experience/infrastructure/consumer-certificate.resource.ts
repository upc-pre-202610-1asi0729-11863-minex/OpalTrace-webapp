import { BaseResource } from '../../shared/infrastructure/base-response';

export interface ConsumerCertificateResource extends BaseResource {
  id: number;
  certId: string;
  productName: string;
  certState: string;
  signatureValid: boolean;
  batchId: string | null;
  issuedAt: string;
  jewelerName: string | null;
}

export interface ConsumerCertificatesResponse {
  certificates: ConsumerCertificateResource[];
}
