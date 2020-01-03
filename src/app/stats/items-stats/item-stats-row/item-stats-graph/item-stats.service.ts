import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemStatisticFullResponse } from './item-stats-response.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class ItemStatsService {

  constructor(private http: HttpClient) {
  }

  public getStatistics(itemId: string): Observable<ItemStatisticFullResponse> {
    return this.http.get<ItemStatisticFullResponse>(`${environment.baseUrl}api/v3/statistics/item/${itemId}`);
  }

}
