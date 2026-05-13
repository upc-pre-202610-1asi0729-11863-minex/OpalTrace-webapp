import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type RefineryBatchStatus = 'Recibido' | 'En Proceso' | 'Completado';

export class RefineryBatch implements BaseEntity {
  private _id: number;
  private _batchId: string;
  private _weightKg: number;
  private _status: RefineryBatchStatus;
  private _receivedAt: string;
  private _location: string;
  private _mineral: string | null;

  constructor(props: {
    id: number;
    batchId: string;
    weightKg: number;
    status: RefineryBatchStatus;
    receivedAt: string;
    location: string;
    mineral: string | null;
  }) {
    this._id = props.id;
    this._batchId = props.batchId;
    this._weightKg = props.weightKg;
    this._status = props.status;
    this._receivedAt = props.receivedAt;
    this._location = props.location;
    this._mineral = props.mineral;
  }

  get id(): number { return this._id; }
  get batchId(): string { return this._batchId; }
  get weightKg(): number { return this._weightKg; }
  get status(): RefineryBatchStatus { return this._status; }
  set status(value: RefineryBatchStatus) { this._status = value; }
  get receivedAt(): string { return this._receivedAt; }
  get location(): string { return this._location; }
  get mineral(): string | null { return this._mineral; }
}
