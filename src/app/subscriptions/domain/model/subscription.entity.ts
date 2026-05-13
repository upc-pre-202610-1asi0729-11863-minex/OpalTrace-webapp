import { BaseEntity } from '../../../shared/domain/model/base-entity';

export type SubscriptionPlan = 'SILVER' | 'GOLD' | 'PLATINUM';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED';

export class Subscription implements BaseEntity {
  private readonly _id: number;
  private readonly _userId: number;
  private readonly _plan: SubscriptionPlan;
  private readonly _status: SubscriptionStatus;
  private readonly _renewalDate: string;
  private readonly _price: number;

  constructor(props: {
    id: number;
    userId: number;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    renewalDate: string;
    price: number;
  }) {
    this._id = props.id;
    this._userId = props.userId;
    this._plan = props.plan;
    this._status = props.status;
    this._renewalDate = props.renewalDate;
    this._price = props.price;
  }

  get id(): number { return this._id; }
  get userId(): number { return this._userId; }
  get plan(): SubscriptionPlan { return this._plan; }
  get status(): SubscriptionStatus { return this._status; }
  get renewalDate(): string { return this._renewalDate; }
  get price(): number { return this._price; }
}
