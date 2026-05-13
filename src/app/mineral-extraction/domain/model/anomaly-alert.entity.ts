import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type AlertType = 'WeightDiscrepancy' | 'DelayedTransport' | 'StateSkipped' | 'Otro';

export class AnomalyAlert implements BaseEntity {
  private _id: number;
  private _alertId: string;
  private _batchId: string;
  private _type: AlertType;
  private _description: string;
  private _timestamp: string;

  constructor(props: {
    id: number; alertId: string; batchId: string;
    type: AlertType; description: string; timestamp: string;
  }) {
    this._id = props.id;
    this._alertId = props.alertId;
    this._batchId = props.batchId;
    this._type = props.type;
    this._description = props.description;
    this._timestamp = props.timestamp;
  }

  get id(): number { return this._id; }
  get alertId(): string { return this._alertId; }
  get batchId(): string { return this._batchId; }
  get type(): AlertType { return this._type; }
  get description(): string { return this._description; }
  get timestamp(): string { return this._timestamp; }
}
