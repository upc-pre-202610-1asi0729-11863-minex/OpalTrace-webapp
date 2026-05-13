import { BaseResource } from '../../shared/infrastructure/base-response';

export interface AnomalyAlertResource extends BaseResource {
  id: number;
  alertId: string;
  batchId: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface AnomalyAlertsResponse {
  alerts: AnomalyAlertResource[];
}
