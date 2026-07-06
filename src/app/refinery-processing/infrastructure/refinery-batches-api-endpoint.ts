import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { RefineryBatch } from '../domain/model/refinery-batch.entity';
import { RefineryBatchResource, RefineryBatchesResponse } from './refinery-batch.resource';
import { RefineryBatchAssembler } from './refinery-batch.assembler';
import { environment } from '../../../environments/environment';

export interface ReceiveBatchCommand {
  batchId: string;
  refineryId: number | null;
  supervisorId: number | null;
  declaredWeightKg: number;
}

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

  /**
   * Records batch reception at the refinery (US09).
   * Backend contract: POST /refinery/batches/{batchPk}/receive.
   */
  receiveBatch(batchPk: number, command: ReceiveBatchCommand, location: string): Observable<RefineryBatch> {
    return this.http.post<any>(`${this.endpointUrl}/${batchPk}/receive`, command).pipe(
      map(r => new RefineryBatch({
        id:         r?.id ?? 0,
        batchId:    r?.batchId ?? command.batchId,
        weightKg:   r?.declaredWeightKg ?? command.declaredWeightKg,
        status:     'Recibido',
        receivedAt: r?.receivedAt ?? new Date().toISOString(),
        location,
        mineral:    null,
      })),
      catchError(this.handleError('Failed to receive batch at refinery'))
    );
  }
}