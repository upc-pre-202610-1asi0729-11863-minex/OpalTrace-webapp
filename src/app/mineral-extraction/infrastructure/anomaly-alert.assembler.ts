import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AnomalyAlert, AlertType } from '../domain/model/anomaly-alert.entity';
import { AnomalyAlertResource, AnomalyAlertsResponse } from './anomaly-alert.resource';

export class AnomalyAlertAssembler implements BaseAssembler<AnomalyAlert, AnomalyAlertResource, AnomalyAlertsResponse> {
  toEntitiesFromResponse(response: AnomalyAlertsResponse): AnomalyAlert[] {
    return response.alerts.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: AnomalyAlertResource): AnomalyAlert {
    return new AnomalyAlert({
      id: resource.id,
      alertId: resource.alertId,
      batchId: resource.batchId,
      type: resource.type as AlertType,
      description: resource.description,
      timestamp: resource.timestamp,
    });
  }

  toResourceFromEntity(entity: AnomalyAlert): AnomalyAlertResource {
    return {
      id: entity.id,
      alertId: entity.alertId,
      batchId: entity.batchId,
      type: entity.type,
      description: entity.description,
      timestamp: entity.timestamp,
    };
  }
}
