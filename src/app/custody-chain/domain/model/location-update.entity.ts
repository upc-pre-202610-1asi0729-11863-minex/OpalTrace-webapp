import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class LocationUpdateRecord implements BaseEntity {
  private _id: number;
  private _batchId: string;
  private _lat: number;
  private _lon: number;
  private _timestamp: string;
  private _actor: string;

  constructor(props: { id: number; batchId: string; lat: number; lon: number; timestamp: string; actor: string }) {
    this._id = props.id;
    this._batchId = props.batchId;
    this._lat = props.lat;
    this._lon = props.lon;
    this._timestamp = props.timestamp;
    this._actor = props.actor;
  }

  get id(): number { return this._id; }
  get batchId(): string { return this._batchId; }
  get lat(): number { return this._lat; }
  get lon(): number { return this._lon; }
  get timestamp(): string { return this._timestamp; }
  get actor(): string { return this._actor; }
}