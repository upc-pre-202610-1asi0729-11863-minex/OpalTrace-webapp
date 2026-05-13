import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { JewelryCertificate } from '../domain/model/jewelry-certificate.entity';
import { JewelryCertificateResource, JewelryCertificatesResponse } from './jewelry-certificate.resource';

export class JewelryCertificateAssembler
  implements BaseAssembler<JewelryCertificate, JewelryCertificateResource, JewelryCertificatesResponse> {

  toEntityFromResource(resource: JewelryCertificateResource): JewelryCertificate {
    return new JewelryCertificate({
      id: resource.id,
      certId: resource.certId,
      productName: resource.productName,
      certState: resource.certState,
      signatureValid: resource.signatureValid,
      batchId: resource.batchId,
      issuedAt: resource.issuedAt,
      jewelerName: resource.jewelerName,
    });
  }

  toResourceFromEntity(entity: JewelryCertificate): JewelryCertificateResource {
    return {
      id: entity.id,
      certId: entity.certId,
      productName: entity.productName,
      certState: entity.certState,
      signatureValid: entity.signatureValid,
      batchId: entity.batchId,
      issuedAt: entity.issuedAt,
      jewelerName: entity.jewelerName,
    };
  }

  toEntitiesFromResponse(response: JewelryCertificatesResponse): JewelryCertificate[] {
    return response.certificates.map(r => this.toEntityFromResource(r));
  }
}
