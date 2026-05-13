import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type Segment  = 'MINING' | 'JEWELRY' | 'CONSUMER';
export type PlanTier = 'SILVER' | 'GOLD' | 'PLATINUM';
export type UserRole = 'SUPERVISOR' | 'ADMIN' | 'CONSUMER';

export class User implements BaseEntity {
  private readonly _id:          number;
  private readonly _email:       string;
  private readonly _firstName:   string;
  private readonly _lastName:    string;
  private readonly _gender:      'M' | 'F';
  private readonly _segment:     Segment;
  private readonly _planTier:    PlanTier;
  private readonly _role:        UserRole;
  private readonly _companyName: string;
  private readonly _ruc:         string;
  private readonly _token:       string;

  constructor(props: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    gender: 'M' | 'F';
    segment: Segment;
    planTier: PlanTier;
    role: UserRole;
    companyName: string;
    ruc: string;
    token: string;
  }) {
    this._id          = props.id;
    this._email       = props.email;
    this._firstName   = props.firstName;
    this._lastName    = props.lastName;
    this._gender      = props.gender;
    this._segment     = props.segment;
    this._planTier    = props.planTier;
    this._role        = props.role;
    this._companyName = props.companyName;
    this._ruc         = props.ruc;
    this._token       = props.token;
  }

  get id():          number   { return this._id; }
  get email():       string   { return this._email; }
  get firstName():   string   { return this._firstName; }
  get lastName():    string   { return this._lastName; }
  get fullName():    string   { return `${this._firstName} ${this._lastName}`; }
  get gender():      'M'|'F'  { return this._gender; }
  get segment():     Segment  { return this._segment; }
  get planTier():    PlanTier { return this._planTier; }
  get role():        UserRole { return this._role; }
  get companyName(): string   { return this._companyName; }
  get ruc():         string   { return this._ruc; }
  get token():       string   { return this._token; }

  get isBusiness(): boolean { return this._segment === 'MINING' || this._segment === 'JEWELRY'; }
  get isPlatinum(): boolean { return this._planTier === 'PLATINUM'; }
}
