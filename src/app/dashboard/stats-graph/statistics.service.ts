import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { StatisticFullResponse } from './statistic-response.interface';
import { HttpService } from '../../core/http/http.service';

@Injectable()
export class StatisticsService {

  constructor(private http: HttpService) {
  }

  public getStatistics(duration: string = '30'): Observable<StatisticFullResponse> {
    return this.http.get('api/v3/protool/dashboard/statistics?durationInDays=' + duration)
      .map((res: Response) => res.json());
  }
}
