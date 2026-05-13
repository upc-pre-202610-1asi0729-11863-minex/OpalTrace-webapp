import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { VerificationEvent } from '../domain/model/verification-event.entity';
import { VerificationEventResource, VerificationEventsResponse } from './verification-event.resource';

export class VerificationEventAssembler implements BaseAssembler<
  VerificationEvent,
  VerificationEventResource,
  VerificationEventsResponse
> {
  toEntitiesFromResponse(response: VerificationEventsResponse): VerificationEvent[] {
    return response.events.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: VerificationEventResource): VerificationEvent {
    return new VerificationEvent({
      id: resource.id,
      certId: resource.certId,
      timestamp: resource.timestamp,
      result: resource.result as 'AUTHENTIC' | 'NOT_FOUND' | 'REVOKED',
    });
  }

  toResourceFromEntity(entity: VerificationEvent): VerificationEventResource {
    return {
      id: entity.id,
      certId: entity.certId,
      timestamp: entity.timestamp,
      result: entity.result,
    };
  }
}
