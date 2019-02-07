import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from '../../../../core/http/http.service';
import { Observable } from 'rxjs';
import { StatisticFullResponse } from '../../../../dashboard/stats-graph/statistic-response.interface';
import { ItemStatisticFullResponse } from './item-stats-response.interface';

@Injectable()
export class ItemStatsService {

  constructor(private http: HttpService) {
  }

  public getStatistics(itemId: string): Observable<ItemStatisticFullResponse> {
    return this.http.get('api/v3/statistics/item/' + itemId)
     .map((res: Response) => res.json());
  }

}
