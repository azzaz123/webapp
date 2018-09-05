import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpService } from '../../../../core/http/http.service';
import { Observable } from 'rxjs/Observable';
import { StatisticFullResponse } from '../../../../dashboard/stats-graph/statistic-response.interface';
import { ItemStatisticFullResponse } from './item-stats-response.interface';

@Injectable()
export class ItemStatsService {

  constructor(private http: HttpService) {
  }

  public getStatistics(): Observable<ItemStatisticFullResponse> {
    /*return this.http.get('api/v3/protool/dashboard/statistics?durationInDays=7')
     .map((res: Response) => res.json());*/
    return Observable.of({
      'entries': [{
        'date': '1504569600000',
        'values': {'favs': 66, 'views': 35, 'chats': 73}
      }, {
        'date': '1504656000000',
        'values': {'favs': 59, 'views': 35, 'chats': 80}
      }, {
        'date': '1504742400000',
        'bumped': true,
        'values': {'favs': 89, 'views': 98, 'chats': 70}
      }, {
        'date': '1504828800000',
        'bumped': true,
        'values': {'favs': 100, 'views': 50, 'chats': 100}
      }, {
        'date': '1504915200000',
        'values': {'favs': 150, 'views': 90, 'chats': 50}
      }, {
        'date': '1505001600000',
        'values': {'favs': 44, 'views': 48, 'chats': 87}
      }, {
        'date': '1505088000000',
        'values': {'favs': 95, 'views': 37, 'chats': 63}
      }]
    });
  }

}
