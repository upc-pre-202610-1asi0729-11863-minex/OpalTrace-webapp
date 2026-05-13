import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { SubLot } from '../domain/model/sublot.entity';
import { SubLotResource, SubLotsResponse } from './sublot.resource';
import { SubLotAssembler } from './sublot.assembler';
import { environment } from '../../../environments/environment';

export class SublotsApiEndpoint extends BaseApiEndpoint<
  SubLot,
  SubLotResource,
  SubLotsResponse,
  SubLotAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderSublotsEndpointPath}`,
      new SubLotAssembler()
    );
  }
}