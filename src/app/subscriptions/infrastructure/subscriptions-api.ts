import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Subscription } from '../domain/model/subscription.entity';
import { BillingRecord } from '../domain/model/billing-record.entity';
import { SubscriptionsApiEndpoint } from './subscriptions-api-endpoint';
import { BillingRecordsApiEndpoint } from './billing-records-api-endpoint';

@Injectable({ providedIn: 'root' })
export class SubscriptionsApi extends BaseApi {
  private readonly subscriptionsEndpoint: SubscriptionsApiEndpoint;
  private readonly billingRecordsEndpoint: BillingRecordsApiEndpoint;

  constructor(private http: HttpClient) {
    super();
    this.subscriptionsEndpoint = new SubscriptionsApiEndpoint(http);
    this.billingRecordsEndpoint = new BillingRecordsApiEndpoint(http);
  }

  getSubscriptionByUser(userId: number): Observable<Subscription | null> {
    return this.subscriptionsEndpoint.getByUserId(userId);
  }

  activateSubscription(userId: number, planTier: string, paymentMethodToken: string, amount: number): Observable<Subscription> {
    return this.subscriptionsEndpoint.activate(userId, planTier, paymentMethodToken, amount);
  }

  upgradeSubscription(subscriptionId: number, userId: number, newTier: string, paymentMethodToken: string): Observable<Subscription> {
    return this.subscriptionsEndpoint.upgradePlan(subscriptionId, userId, newTier, paymentMethodToken);
  }

  updateSubscription(subscription: Subscription): Observable<Subscription> {
    return this.subscriptionsEndpoint.update(subscription, subscription.id);
  }

  getBillingRecordsByUser(userId: number): Observable<BillingRecord[]> {
    return this.billingRecordsEndpoint.getByUserId(userId);
  }

  createBillingRecord(record: BillingRecord): Observable<BillingRecord> {
    return this.billingRecordsEndpoint.create(record);
  }
}