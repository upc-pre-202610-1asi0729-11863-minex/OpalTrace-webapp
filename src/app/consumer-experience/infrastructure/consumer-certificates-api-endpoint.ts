import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { ConsumerCertificate } from '../domain/model/consumer-certificate.entity';
import { ConsumerCertificateResource, ConsumerCertificatesResponse } from './consumer-certificate.resource';
import { ConsumerCertificateAssembler } from './consumer-certificate.assembler';
import { environment } from '../../../environments/environment';

export class ConsumerCertificatesApiEndpoint extends BaseApiEndpoint<
  ConsumerCertificate,
  ConsumerCertificateResource,
  ConsumerCertificatesResponse,
  ConsumerCertificateAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderCertificatesEndpointPath}`,
      new ConsumerCertificateAssembler()
    );
  }
}
