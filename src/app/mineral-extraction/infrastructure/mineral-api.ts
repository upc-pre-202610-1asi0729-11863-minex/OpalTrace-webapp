import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { MineralBatch } from '../domain/model/mineral-batch.entity';
import { AnomalyAlert } from '../domain/model/anomaly-alert.entity';
import { BatchesApiEndpoint } from './batches-api-endpoint';
import { AlertsApiEndpoint } from './alerts-api-endpoint';

@Injectable({ providedIn: 'root' })
export class MineralApi extends BaseApi {
  private readonly batchesEndpoint: BatchesApiEndpoint;
  private readonly alertsEndpoint: AlertsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.batchesEndpoint = new BatchesApiEndpoint(http);
    this.alertsEndpoint  = new AlertsApiEndpoint(http);
  }

  getBatchesByUser(userId: number): Observable<MineralBatch[]>        { return this.batchesEndpoint.getByUserId(userId); }
  getBatch(id: number): Observable<MineralBatch>                     { return this.batchesEndpoint.getById(id); }
  getBatchByBatchId(batchId: string): Observable<MineralBatch | null>{ return this.batchesEndpoint.getBatchByBatchId(batchId); }
  createBatch(batch: MineralBatch): Observable<MineralBatch>         { return this.batchesEndpoint.create(batch); }
  updateBatch(batch: MineralBatch): Observable<MineralBatch>         { return this.batchesEndpoint.update(batch, batch.id); }

  getAlertsByBatch(batchPk: number): Observable<AnomalyAlert[]>              { return this.alertsEndpoint.getByBatchPk(batchPk); }
  createAlert(batchPk: number, alert: AnomalyAlert): Observable<AnomalyAlert> { return this.alertsEndpoint.createForBatch(batchPk, alert); }
}
