import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { MineralBatch, MineralType, BatchStatus } from '../domain/model/mineral-batch.entity';
import { MineralBatchResource, MineralBatchesResponse } from './mineral-batch.resource';

export class MineralBatchAssembler implements BaseAssembler<MineralBatch, MineralBatchResource, MineralBatchesResponse> {
  private readonly STATUS_MAP: Record<string, BatchStatus> = {
    'EN_ORIGEN':   'En Origen',
    'EN_TRANSITO': 'En Tránsito',
    'EN_PLANTA':   'En Planta',
    'PROCESADO':   'En Planta',
    'CERTIFICADO': 'Certificado',
  };

  private readonly MINERAL_TO_DOMAIN: Record<string, MineralType> = {
    'GOLD':   'Oro',
    'SILVER': 'Plata',
  };

  private readonly MINERAL_TO_BACKEND: Record<MineralType, string> = {
    'Oro':   'GOLD',
    'Plata': 'SILVER',
  };

  private mapStatus(raw: string): BatchStatus {
    return this.STATUS_MAP[raw?.toUpperCase()] ?? (raw as BatchStatus);
  }

  private mapMineral(raw: string): MineralType {
    return this.MINERAL_TO_DOMAIN[raw?.toUpperCase()] ?? (raw as MineralType);
  }

  toBackendMineralType(mineral: MineralType): string {
    return this.MINERAL_TO_BACKEND[mineral] ?? 'OTHER';
  }

  toEntitiesFromResponse(response: MineralBatchesResponse): MineralBatch[] {
    return response.batches.map(r => this.toEntityFromResource(r));
  }

  toEntityFromResource(resource: MineralBatchResource): MineralBatch {
    return new MineralBatch({
      id: resource.id,
      batchId: resource.batchId,
      mineral: this.mapMineral(resource.mineralType),
      weightKg: resource.weightKg,
      status: this.mapStatus(resource.status),
      isBlocked: resource.blocked,
      gpsLat: resource.originLatitude,
      gpsLon: resource.originLongitude,
      timestamp: '',
      txHash: resource.blockchainTxHash ?? '',
      userId: resource.miningCompanyId ?? resource.supervisorId ?? 0,
      anomalyReason: null,
    });
  }

  toResourceFromEntity(entity: MineralBatch): MineralBatchResource {
    return {
      id: entity.id,
      batchId: entity.batchId,
      mineralType: this.toBackendMineralType(entity.mineral),
      weightKg: entity.weightKg,
      originLatitude: entity.gpsLat,
      originLongitude: entity.gpsLon,
      status: entity.status,
      blocked: entity.isBlocked,
      supervisorId: entity.userId,
      miningCompanyId: entity.userId,
      blockchainTxHash: entity.txHash,
      parentBatchId: null,
      qrCodeData: null,
    };
  }
}
