import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Subscription } from '../domain/model/subscription.entity';
import { SubscriptionResource, SubscriptionsResponse } from './subscription.resource';

export class SubscriptionAssembler
  implements BaseAssembler<Subscription, SubscriptionResource, SubscriptionsResponse> {

  toEntityFromResource(resource: SubscriptionResource): Subscription {
    return new Subscription({
      id: resource.id,
      userId: resource.userId,
      plan: resource.plan,
      status: resource.status,
      renewalDate: resource.renewalDate,
      price: resource.price,
    });
  }

  toResourceFromEntity(entity: Subscription): SubscriptionResource {
    return {
      id: entity.id,
      userId: entity.userId,
      plan: entity.plan,
      status: entity.status,
      renewalDate: entity.renewalDate,
      price: entity.price,
    };
  }

  toEntitiesFromResponse(response: SubscriptionsResponse): Subscription[] {
    if (response.subscriptions) {
      return response.subscriptions.map(r => this.toEntityFromResource(r));
    }
    return [];
  }
}
