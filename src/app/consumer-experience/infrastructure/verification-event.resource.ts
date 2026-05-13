import { BaseResource } from '../../shared/infrastructure/base-response';

export interface VerificationEventResource extends BaseResource {
  id: number;
  certId: string;
  timestamp: string;
  result: string;
}

export interface VerificationEventsResponse {
  events: VerificationEventResource[];
}
