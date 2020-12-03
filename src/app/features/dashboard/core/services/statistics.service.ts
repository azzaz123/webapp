import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { StatisticFullResponse } from '../statistic-response.interface';

export const STATISTICS_ENDPOINT = 'api/v3/protool/dashboard/statistics/';

@Injectable()
export class StatisticsService {
  constructor(private http: HttpClient) {}

  public getStatistics(
    durationInDays: string = '30'
  ): Observable<StatisticFullResponse> {
    return this.http.get<StatisticFullResponse>(
      `${environment.baseUrl}${STATISTICS_ENDPOINT}`,
      { params: { durationInDays } }
    );
  }
}
