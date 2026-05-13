import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { MineralBatch, MineralType, BatchStatus } from '../domain/model/mineral-batch.entity';
import { MineralBatchResource, MineralBatchesResponse } from './mineral-batch.resource';

export class MineralBatchAssembler implements BaseAssembler<MineralBatch, MineralBatchResource, MineralBatchesResponse> {
  private readonly STATUS_MAP: Record<string, BatchStatus> = {
    'REGISTERED':  'En Origen',
    'IN_TRANSIT':  'En Tránsito',
    'AT_REFINERY': 'En Planta',
    'CERTIFIED':   'Certificado',
    'ANOMALY':     'En Origen',
  };

  private mapStatus(raw: string): BatchStatus {
    return this.STATUS_MAP[raw.toUpperCase()] ?? (raw as BatchStatus);
  }

  toEntitiesFromResponse(response: MineralBatchesResponse): MineralBatch[] {
    return response.batches.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: MineralBatchResource): MineralBatch {
    return new MineralBatch({
      id: resource.id,
      batchId: resource.batchId,
      mineral: resource.mineral as MineralType,
      weightKg: resource.weightKg,
      status: this.mapStatus(resource.status),
      isBlocked: resource.isBlocked,
      gpsLat: resource.gpsLat,
      gpsLon: resource.gpsLon,
      timestamp: resource.timestamp,
      txHash: resource.txHash,
      userId: resource.userId,
      anomalyReason: resource.anomalyReason ?? null,
    });
  }

  toResourceFromEntity(entity: MineralBatch): MineralBatchResource {
    return {
      id: entity.id,
      batchId: entity.batchId,
      mineral: entity.mineral,
      weightKg: entity.weightKg,
      status: entity.status,
      isBlocked: entity.isBlocked,
      gpsLat: entity.gpsLat,
      gpsLon: entity.gpsLon,
      timestamp: entity.timestamp,
      txHash: entity.txHash,
      userId: entity.userId,
      anomalyReason: entity.anomalyReason,
    };
  }
}
