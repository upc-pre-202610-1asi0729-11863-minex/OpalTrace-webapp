import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type CertificateState = 'CERTIFIED' | 'REVOKED';

export class ConsumerCertificate implements BaseEntity {
  private _id: number;
  private _certId: string;
  private _productName: string;
  private _certState: CertificateState;
  private _signatureValid: boolean;
  private _batchId: string | null;
  private _issuedAt: string;
  private _jewelerName: string | null;

  constructor(props: {
    id: number;
    certId: string;
    productName: string;
    certState: CertificateState;
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
  get certState(): CertificateState { return this._certState; }
  get signatureValid(): boolean { return this._signatureValid; }
  get batchId(): string | null { return this._batchId; }
  get issuedAt(): string { return this._issuedAt; }
  get jewelerName(): string | null { return this._jewelerName; }
}
