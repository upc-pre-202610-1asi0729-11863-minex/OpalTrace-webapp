import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class BillingRecord implements BaseEntity {
  private readonly _id: number;
  private readonly _userId: number;
  private readonly _date: string;
  private readonly _plan: string;
  private readonly _amount: number;
  private readonly _status: string;

  constructor(props: {
    id: number;
    userId: number;
    date: string;
    plan: string;
    amount: number;
    status: string;
  }) {
    this._id = props.id;
    this._userId = props.userId;
    this._date = props.date;
    this._plan = props.plan;
    this._amount = props.amount;
    this._status = props.status;
  }

  get id(): number { return this._id; }
  get userId(): number { return this._userId; }
  get date(): string { return this._date; }
  get plan(): string { return this._plan; }
  get amount(): number { return this._amount; }
  get status(): string { return this._status; }
}
