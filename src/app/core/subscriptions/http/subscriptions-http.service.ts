import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { SUBSCRIPTIONS_V3_ENDPOINT } from './endpoints';
import { SubscriptionsV3Response } from '../dtos/subscriptions/subscription-response.interface';

@Injectable()
export class SubscriptionsHttpService {
  public constructor(private httpClient: HttpClient) {}

  public get(): Observable<SubscriptionsV3Response[]> {
    return this.httpClient.get<SubscriptionsV3Response[]>(SUBSCRIPTIONS_V3_ENDPOINT);
  }
}
