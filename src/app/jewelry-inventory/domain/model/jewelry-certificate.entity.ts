import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class JewelryCertificate implements BaseEntity {
  private readonly _id: number;
  private readonly _certId: string;
  private readonly _productName: string;
  private readonly _certState: 'CERTIFIED' | 'REVOKED';
  private readonly _signatureValid: boolean;
  private readonly _batchId: string | null;
  private readonly _issuedAt: string;
  private readonly _jewelerName: string | null;

  constructor(props: {
    id: number;
    certId: string;
    productName: string;
    certState: 'CERTIFIED' | 'REVOKED';
    signatureValid: boolean;
    batchId: string | null;
    issuedAt: string;
    jewelerName: string | null;
  }) {
    this._id = props.id;
    this._certId = props.certId;
    this._productName = props.productName;
    this._certState = props.certState;
    this._signatureValid = props.signatureValid;
    this._batchId = props.batchId;
    this._issuedAt = props.issuedAt;
    this._jewelerName = props.jewelerName;
  }

  get id(): number { return this._id; }
  get certId(): string { return this._certId; }
  get productName(): string { return this._productName; }
  get certState(): 'CERTIFIED' | 'REVOKED' { return this._certState; }
  get signatureValid(): boolean { return this._signatureValid; }
  get batchId(): string | null { return this._batchId; }
  get issuedAt(): string { return this._issuedAt; }
  get jewelerName(): string | null { return this._jewelerName; }
}
