import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { CAN_UPDATE_SUBSCRIPTION, SUBSCRIPTIONS_V3_ENDPOINT } from './endpoints';
import { SubscriptionsV3Response } from '../dtos/subscriptions/subscription-response.interface';

@Injectable()
export class SubscriptionsHttpService {
  public constructor(private httpClient: HttpClient) {}

  public get(): Observable<SubscriptionsV3Response[]> {
    return this.httpClient.get<SubscriptionsV3Response[]>(SUBSCRIPTIONS_V3_ENDPOINT);
  }

  public canUpdateSubscription(subscriptionId: string, tierId: string): Observable<any> {
    let params = new HttpParams();
    params = params.append('tier_id', tierId);
    return this.httpClient.get<SubscriptionsV3Response[]>(CAN_UPDATE_SUBSCRIPTION(subscriptionId), { params });
  }
}
