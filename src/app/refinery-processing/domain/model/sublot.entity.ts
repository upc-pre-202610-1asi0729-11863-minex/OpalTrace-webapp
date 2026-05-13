import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type SubLotStatus = 'Activo' | 'Completado';

export class SubLot implements BaseEntity {
  private _id: number;
  private _sublotId: string;
  private _parentBatchId: string;
  private _weightKg: number;
  private _status: SubLotStatus;

  constructor(props: {
    id: number;
    sublotId: string;
    parentBatchId: string;
    weightKg: number;
    status: SubLotStatus;
  }) {
    this._id = props.id;
    this._sublotId = props.sublotId;
    this._parentBatchId = props.parentBatchId;
    this._weightKg = props.weightKg;
    this._status = props.status;
  }

  get id(): number { return this._id; }
  get sublotId(): string { return this._sublotId; }
  get parentBatchId(): string { return this._parentBatchId; }
  get weightKg(): number { return this._weightKg; }
  get status(): SubLotStatus { return this._status; }
  set status(value: SubLotStatus) { this._status = value; }
}
