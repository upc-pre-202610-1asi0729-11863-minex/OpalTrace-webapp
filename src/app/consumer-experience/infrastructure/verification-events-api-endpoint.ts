import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { VerificationEvent } from '../domain/model/verification-event.entity';
import { VerificationEventResource, VerificationEventsResponse } from './verification-event.resource';
import { VerificationEventAssembler } from './verification-event.assembler';
import { environment } from '../../../environments/environment';

export class VerificationEventsApiEndpoint extends BaseApiEndpoint<
  VerificationEvent,
  VerificationEventResource,
  VerificationEventsResponse,
  VerificationEventAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderVerificationEventsEndpointPath}`,
      new VerificationEventAssembler()
    );
  }
}
