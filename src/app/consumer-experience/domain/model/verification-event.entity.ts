import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class VerificationEvent implements BaseEntity {
  private _id: number;
  private _certId: string;
  private _timestamp: string;
  private _result: 'AUTHENTIC' | 'NOT_FOUND' | 'REVOKED';

  constructor(props: {
    id: number;
    certId: string;
    timestamp: string;
    result: 'AUTHENTIC' | 'NOT_FOUND' | 'REVOKED';
  }) {
    this._id = props.id;
    this._certId = props.certId;
    this._timestamp = props.timestamp;
    this._result = props.result;
  }

  get id(): number { return this._id; }
  get certId(): string { return this._certId; }
  get timestamp(): string { return this._timestamp; }
  get result(): 'AUTHENTIC' | 'NOT_FOUND' | 'REVOKED' { return this._result; }
}
