import { UserCounter } from './user-counter';
import { UserRating } from './user-rating';

export interface UserStats {
  ratings: UserRating;
  counters: UserCounter;
}
