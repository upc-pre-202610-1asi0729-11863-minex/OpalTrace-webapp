import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Subscription } from '../domain/model/subscription.entity';
import { SubscriptionResource, SubscriptionsResponse } from './subscription.resource';
import { SubscriptionAssembler } from './subscription.assembler';
import { environment } from '../../../environments/environment';

export class SubscriptionsApiEndpoint extends BaseApiEndpoint<
  Subscription,
  SubscriptionResource,
  SubscriptionsResponse,
  SubscriptionAssembler
> {
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderSubscriptionsEndpointPath}`,
      new SubscriptionAssembler()
    );
  }

  getByUserId(userId: number): Observable<Subscription | null> {
    return this.http.get<SubscriptionResource>(`${this.endpointUrl}/user/${userId}`).pipe(
      map(r => r ? this.assembler.toEntityFromResource(r) : null),
      catchError(this.handleError('Failed to fetch subscription by userId'))
    );
  }
}
