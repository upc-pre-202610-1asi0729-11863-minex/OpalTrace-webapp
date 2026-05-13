import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class AnalyticsMetric implements BaseEntity {
  private _id: number;
  private _name: string;
  private _value: string | number;
  private _period: string;

  constructor(props: {
    id: number;
    name: string;
    value: string | number;
    period: string;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._value = props.value;
    this._period = props.period;
  }

  get id(): number { return this._id; }
  get name(): string { return this._name; }
  get value(): string | number { return this._value; }
  get period(): string { return this._period; }
}