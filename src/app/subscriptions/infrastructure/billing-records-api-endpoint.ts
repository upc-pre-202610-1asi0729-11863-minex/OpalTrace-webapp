import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BillingRecord } from '../domain/model/billing-record.entity';
import { BillingRecordResource, BillingRecordsResponse } from './billing-record.resource';
import { BillingRecordAssembler } from './billing-record.assembler';
import { environment } from '../../../environments/environment';

export class BillingRecordsApiEndpoint extends BaseApiEndpoint<
  BillingRecord,
  BillingRecordResource,
  BillingRecordsResponse,
  BillingRecordAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderBillingRecordsEndpointPath}`,
      new BillingRecordAssembler()
    );
  }

  getByUserId(userId: number): Observable<BillingRecord[]> {
    return this.http.get<BillingRecordResource[]>(`${this.endpointUrl}/user/${userId}`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch billing records by userId'))
    );
  }
}
