import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type MineralType = 'Oro' | 'Plata';
export type BatchStatus = 'En Origen' | 'En Tránsito' | 'En Planta' | 'Certificado';

export class MineralBatch implements BaseEntity {
  private _id: number;
  private _batchId: string;
  private _mineral: MineralType;
  private _weightKg: number;
  private _status: BatchStatus;
  private _isBlocked: boolean;
  private _gpsLat: number;
  private _gpsLon: number;
  private _timestamp: string;
  private _txHash: string;
  private _userId: number;
  private _anomalyReason: string | null;

  constructor(props: {
    id: number; batchId: string; mineral: MineralType; weightKg: number;
    status: BatchStatus; isBlocked: boolean; gpsLat: number; gpsLon: number;
    timestamp: string; txHash: string; userId: number; anomalyReason?: string | null;
  }) {
    this._id = props.id;
    this._batchId = props.batchId;
    this._mineral = props.mineral;
    this._weightKg = props.weightKg;
    this._status = props.status;
    this._isBlocked = props.isBlocked;
    this._gpsLat = props.gpsLat;
    this._gpsLon = props.gpsLon;
    this._timestamp = props.timestamp;
    this._txHash = props.txHash;
    this._userId = props.userId;
    this._anomalyReason = props.anomalyReason ?? null;
  }

  get id(): number { return this._id; }
  get batchId(): string { return this._batchId; }
  get mineral(): MineralType { return this._mineral; }
  get weightKg(): number { return this._weightKg; }
  get status(): BatchStatus { return this._status; }
  set status(value: BatchStatus) { this._status = value; }
  get isBlocked(): boolean { return this._isBlocked; }
  set isBlocked(value: boolean) { this._isBlocked = value; }
  get gpsLat(): number { return this._gpsLat; }
  get gpsLon(): number { return this._gpsLon; }
  get timestamp(): string { return this._timestamp; }
  get txHash(): string { return this._txHash; }
  get userId(): number { return this._userId; }
  get anomalyReason(): string | null { return this._anomalyReason; }
}
