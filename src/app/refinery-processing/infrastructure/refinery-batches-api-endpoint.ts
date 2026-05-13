import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { RefineryBatch } from '../domain/model/refinery-batch.entity';
import { RefineryBatchResource, RefineryBatchesResponse } from './refinery-batch.resource';
import { RefineryBatchAssembler } from './refinery-batch.assembler';
import { environment } from '../../../environments/environment';

export class RefineryBatchesApiEndpoint extends BaseApiEndpoint<
  RefineryBatch,
  RefineryBatchResource,
  RefineryBatchesResponse,
  RefineryBatchAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderRefineryBatchesEndpointPath}`,
      new RefineryBatchAssembler()
    );
  }
}