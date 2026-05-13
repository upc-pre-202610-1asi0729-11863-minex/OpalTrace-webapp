import { HttpClient } from '@angular/common/http';
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
}
