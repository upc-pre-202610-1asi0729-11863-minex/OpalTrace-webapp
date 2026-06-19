import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { JewelryCertificate } from '../domain/model/jewelry-certificate.entity';
import { JewelryCertificateResource, JewelryCertificatesResponse } from './jewelry-certificate.resource';
import { JewelryCertificateAssembler } from './jewelry-certificate.assembler';
import { environment } from '../../../environments/environment';

export class JewelryCertificatesApiEndpoint extends BaseApiEndpoint<
  JewelryCertificate,
  JewelryCertificateResource,
  JewelryCertificatesResponse,
  JewelryCertificateAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderCertificatesEndpointPath}`,
      new JewelryCertificateAssembler()
    );
  }

  getByUserId(_userId: number): Observable<JewelryCertificate[]> {
    return this.http.get<JewelryCertificateResource[]>(`${this.endpointUrl}/certified`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch jewelry certificates'))
    );
  }
}
