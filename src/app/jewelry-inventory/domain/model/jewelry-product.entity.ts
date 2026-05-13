import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type CertState = 'CERTIFIED' | 'PENDING' | 'REJECTED' | null;

export interface TraceabilityEvent {
  type: 'MineralExtracted' | 'TransportStarted' | 'LocationUpdated' | 'BatchReceived' | 'AuthenticityVerified';
  timestamp: string;
  actor?: string;
  txHash?: string;
}

export class JewelryProduct implements BaseEntity {
  private readonly _id: number;
  private readonly _productId: string;
  private readonly _name: string;
  private readonly _weightG: number;
  private readonly _batchId: string | null;
  private readonly _certId: string | null;
  private readonly _isCertifiedSource: boolean;
  private readonly _certState: CertState;
  private readonly _isBlocked: boolean;
  private readonly _supplier: string | null;
  private readonly _events: TraceabilityEvent[];

  constructor(props: {
    id: number;
    productId: string;
    name: string;
    weightG: number;
    batchId: string | null;
    certId: string | null;
    isCertifiedSource: boolean;
    certState: CertState;
    isBlocked: boolean;
    supplier: string | null;
    events?: TraceabilityEvent[];
  }) {
    this._id = props.id;
    this._productId = props.productId;
    this._name = props.name;
    this._weightG = props.weightG;
    this._batchId = props.batchId;
    this._certId = props.certId;
    this._isCertifiedSource = props.isCertifiedSource;
    this._certState = props.certState;
    this._isBlocked = props.isBlocked;
    this._supplier = props.supplier;
    this._events = props.events ?? [];
  }

  get id(): number { return this._id; }
  get productId(): string { return this._productId; }
  get name(): string { return this._name; }
  get weightG(): number { return this._weightG; }
  get batchId(): string | null { return this._batchId; }
  get certId(): string | null { return this._certId; }
  get isCertifiedSource(): boolean { return this._isCertifiedSource; }
  get certState(): CertState { return this._certState; }
  get isBlocked(): boolean { return this._isBlocked; }
  get supplier(): string | null { return this._supplier; }
  get events(): TraceabilityEvent[] { return this._events; }
}
