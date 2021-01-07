import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { UserId } from '../../shared/domain/user-id';
import { UserStats } from './user-stats';

export const USER_STATS_REPOSITORY_TOKEN: InjectionToken<UserStatsRepository> = new InjectionToken<
  UserStatsRepository
>('USER_STATS_REPOSITORY_TOKEN');

export interface UserStatsRepository {
  getStats(): Observable<UserStats>;

  getByUserId(userId: UserId): Observable<UserStats>;
}
