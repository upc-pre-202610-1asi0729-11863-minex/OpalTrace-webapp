import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { ConsumerCertificate, CertificateState } from '../domain/model/consumer-certificate.entity';
import { ConsumerCertificateResource, ConsumerCertificatesResponse } from './consumer-certificate.resource';

export class ConsumerCertificateAssembler implements BaseAssembler<
  ConsumerCertificate,
  ConsumerCertificateResource,
  ConsumerCertificatesResponse
> {
  toEntitiesFromResponse(response: ConsumerCertificatesResponse): ConsumerCertificate[] {
    return response.certificates.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: ConsumerCertificateResource): ConsumerCertificate {
    return new ConsumerCertificate({
      id: resource.id,
      certId: resource.certId,
      productName: resource.productName,
      certState: resource.certState as CertificateState,
      signatureValid: resource.signatureValid,
      batchId: resource.batchId,
      issuedAt: resource.issuedAt,
      jewelerName: resource.jewelerName,
    });
  }

  toResourceFromEntity(entity: ConsumerCertificate): ConsumerCertificateResource {
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
}
