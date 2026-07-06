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
    return this.http.get<MineralBatchResource[]>(`${this.endpointUrl}/company/${userId}`).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r))),
      catchError(this.handleError('Failed to fetch batches by userId'))
    );
  }

  /**
   * Registers a batch using the backend contract (US01).
   * Backend expects { mineralType, weightKg, latitude, longitude, supervisorId, miningCompanyId }
   * and returns the persisted MineralBatchResource with its generated OT-YYYY-NNNN code.
   */
  registerBatch(batch: MineralBatch): Observable<MineralBatch> {
    const body = {
      mineralType:     this.assembler.toBackendMineralType(batch.mineral),
      weightKg:        batch.weightKg,
      latitude:        batch.gpsLat,
      longitude:       batch.gpsLon,
      supervisorId:    batch.userId,
      miningCompanyId: batch.userId,
    };
    return this.http.post<MineralBatchResource>(this.endpointUrl, body).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to register batch'))
    );
  }

  getBatchByBatchId(batchId: string): Observable<MineralBatch | null> {
    return this.http.get<MineralBatchResource>(`${this.endpointUrl}/code/${encodeURIComponent(batchId)}`).pipe(
      map(resource => resource ? this.assembler.toEntityFromResource(resource) : null),
      catchError(this.handleError('Failed to fetch batch by batchId'))
    );
  }
}
