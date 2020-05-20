import { Injectable } from '@angular/core';
import {of as observableOf,  Observable } from 'rxjs';
import { ItemStatisticFullResponse } from './item-stats-response.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ITEM_STATISTIC_RESPONSE } from 'tests/statistics.fixtures.spec';

export const ITEM_STATS_ENDPOINT = 'api/v3/statistics/item/';

@Injectable()
export class ItemStatsService {

  constructor(private http: HttpClient) {
  }

  public getStatistics(itemId: string): Observable<ItemStatisticFullResponse> {
    return this.http.get<ItemStatisticFullResponse>(`${environment.baseUrl}${ITEM_STATS_ENDPOINT}${itemId}`);
  }

}
