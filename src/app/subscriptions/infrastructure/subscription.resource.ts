import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { SubscriptionPlan, SubscriptionStatus } from '../domain/model/subscription.entity';

export interface SubscriptionResource extends BaseResource {
  id: number;
  userId: number;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  renewalDate: string;
  price: number;
}

export interface SubscriptionsResponse extends BaseResponse {
  subscriptions?: SubscriptionResource[];
}