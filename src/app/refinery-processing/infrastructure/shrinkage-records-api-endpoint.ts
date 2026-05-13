import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { ShrinkageRecord } from '../domain/model/shrinkage-record.entity';
import { ShrinkageRecordResource, ShrinkageRecordsResponse } from './shrinkage-record.resource';
import { ShrinkageRecordAssembler } from './shrinkage-record.assembler';
import { environment } from '../../../environments/environment';

export class ShrinkageRecordsApiEndpoint extends BaseApiEndpoint<
  ShrinkageRecord,
  ShrinkageRecordResource,
  ShrinkageRecordsResponse,
  ShrinkageRecordAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderShrinkageRecordsEndpointPath}`,
      new ShrinkageRecordAssembler()
    );
  }
}