import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { RefineryBatch } from '../domain/model/refinery-batch.entity';
import { SubLot } from '../domain/model/sublot.entity';
import { ShrinkageRecord } from '../domain/model/shrinkage-record.entity';
import { RefineryBatchesApiEndpoint, ReceiveBatchCommand } from './refinery-batches-api-endpoint';
import { SublotsApiEndpoint } from './sublots-api-endpoint';
import { ShrinkageRecordsApiEndpoint } from './shrinkage-records-api-endpoint';

@Injectable({ providedIn: 'root' })
export class RefineryApi extends BaseApi {
  private readonly refineryBatchesEndpoint: RefineryBatchesApiEndpoint;
  private readonly sublotsEndpoint: SublotsApiEndpoint;
  private readonly shrinkageRecordsEndpoint: ShrinkageRecordsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.refineryBatchesEndpoint = new RefineryBatchesApiEndpoint(http);
    this.sublotsEndpoint = new SublotsApiEndpoint(http);
    this.shrinkageRecordsEndpoint = new ShrinkageRecordsApiEndpoint(http);
  }

  getRefineryBatches(): Observable<RefineryBatch[]> {
    return this.refineryBatchesEndpoint.getAll();
  }

  receiveBatchAtRefinery(batchPk: number, command: ReceiveBatchCommand, location: string): Observable<RefineryBatch> {
    return this.refineryBatchesEndpoint.receiveBatch(batchPk, command, location);
  }

  updateRefineryBatch(batch: RefineryBatch): Observable<RefineryBatch> {
    return this.refineryBatchesEndpoint.update(batch, batch.id);
  }

  getSublots(): Observable<SubLot[]> {
    return this.sublotsEndpoint.getAll();
  }

  createSublot(sublot: SubLot): Observable<SubLot> {
    return this.sublotsEndpoint.create(sublot);
  }

  updateSublot(sublot: SubLot): Observable<SubLot> {
    return this.sublotsEndpoint.update(sublot, sublot.id);
  }

  getShrinkageRecords(): Observable<ShrinkageRecord[]> {
    return this.shrinkageRecordsEndpoint.getAll();
  }

  createShrinkageRecord(record: ShrinkageRecord): Observable<ShrinkageRecord> {
    return this.shrinkageRecordsEndpoint.create(record);
  }
}
