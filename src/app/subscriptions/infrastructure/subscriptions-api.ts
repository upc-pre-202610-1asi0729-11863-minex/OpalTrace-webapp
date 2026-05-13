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

  getSubscriptions(): Observable<Subscription[]> {
    return this.subscriptionsEndpoint.getAll();
  }

  getSubscription(id: number): Observable<Subscription> {
    return this.subscriptionsEndpoint.getById(id);
  }

  updateSubscription(subscription: Subscription): Observable<Subscription> {
    return this.subscriptionsEndpoint.update(subscription, subscription.id);
  }

  getBillingRecords(): Observable<BillingRecord[]> {
    return this.billingRecordsEndpoint.getAll();
  }

  createBillingRecord(record: BillingRecord): Observable<BillingRecord> {
    return this.billingRecordsEndpoint.create(record);
  }
}