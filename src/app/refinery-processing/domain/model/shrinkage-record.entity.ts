import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type ShrinkageType = 'Evaporación' | 'Residuo' | 'Contaminación';

export class ShrinkageRecord implements BaseEntity {
  private _id: number;
  private _batchId: string;
  private _percentage: number;
  private _type: ShrinkageType;
  private _timestamp: string;

  constructor(props: {
    id: number;
    batchId: string;
    percentage: number;
    type: ShrinkageType;
    timestamp: string;
  }) {
    this._id = props.id;
    this._batchId = props.batchId;
    this._percentage = props.percentage;
    this._type = props.type;
    this._timestamp = props.timestamp;
  }

  get id(): number { return this._id; }
  get batchId(): string { return this._batchId; }
  get percentage(): number { return this._percentage; }
  get type(): ShrinkageType { return this._type; }
  get timestamp(): string { return this._timestamp; }
}