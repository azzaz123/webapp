
import { ApiUserStasMapper, ApiUserStatsResponse } from './api-user-stats.response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { UserStats } from 'app/data/user/domain';
import { Observable } from 'rxjs';
import { USER_BASE_ENDPOINT } from '../api-user.constant';
import { UserStatsRepository } from './../../../domain/stats/user-stats.repository';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiUserStatsRepository implements UserStatsRepository {

  static USER_STATS_URL = `${environment.baseUrl}${ USER_BASE_ENDPOINT}stats`;

  constructor(private http: HttpClient) { }

  getStats(): Observable<UserStats> {
    return this.http.get<ApiUserStatsResponse>(ApiUserStatsRepository.USER_STATS_URL).pipe(
      map(ApiUserStasMapper.toDomain)
    );
  }

  getByUserId(userId: string): Observable<UserStats> {
    return this.http.get<ApiUserStatsResponse>(`${ApiUserStatsRepository.USER_STATS_URL}/${userId}`).pipe(
      map(ApiUserStasMapper.toDomain)
    );
  }

}
