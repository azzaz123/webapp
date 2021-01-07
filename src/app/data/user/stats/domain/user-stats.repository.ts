import { Observable } from 'rxjs';
import { UserId } from '../../shared/domain/user-id';
import { UserStats } from './user-stats';

export interface UserStatsRepository {
  getStats(): Observable<UserStats>;

  getByUserId(userId: UserId): Observable<UserStats>;
}
