import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatisticFullResponse } from './statistic-response.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class StatisticsService {

  constructor(private http: HttpClient) {
  }

  public getStatistics(duration = '30'): Observable<StatisticFullResponse> {
    return this.http.get<StatisticFullResponse>(`${environment.baseUrl}api/v3/protool/dashboard/statistics/`, {
      params: { durationInDays: duration}
    });
  }
}
