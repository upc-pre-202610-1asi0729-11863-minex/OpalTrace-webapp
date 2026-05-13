import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { MineralBatch } from '../domain/model/mineral-batch.entity';
import { MineralBatchResource, MineralBatchesResponse } from './mineral-batch.resource';
import { MineralBatchAssembler } from './mineral-batch.assembler';
import { environment } from '../../../environments/environment';

export class BatchesApiEndpoint extends BaseApiEndpoint<
  MineralBatch,
  MineralBatchResource,
  MineralBatchesResponse,
  MineralBatchAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderBatchesEndpointPath}`,
      new MineralBatchAssembler()
    );
  }

  getByUserId(userId: number): Observable<MineralBatch[]> {
    return this.http.get<MineralBatchResource[]>(`${this.endpointUrl}?userId=${userId}`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch batches by userId'))
    );
  }

  getBatchByBatchId(batchId: string): Observable<MineralBatch | null> {
    return this.http.get<MineralBatchResource[]>(`${this.endpointUrl}?batchId=${encodeURIComponent(batchId)}`).pipe(
      map(resources => resources.length > 0 ? this.assembler.toEntityFromResource(resources[0]) : null),
      catchError(this.handleError('Failed to fetch batch by batchId'))
    );
  }
}
