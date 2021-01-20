import { UserCounter, UserRating, UserStats } from '@data/user';
import * as faker from 'faker';

export class UserStatsMother {
  static random(partial: Partial<UserStats> = {}): UserStats {
    return {
      ratings: UserRatingMother.random(),
      counters: UserCounterMother.random(partial.counters),
      ...partial,
    };
  }
}

export class UserRatingMother {
  static random(): UserRating {
    return {
      reviews: faker.random.number(),
    };
  }
}

export class UserCounterMother {
  static random(partial: Partial<UserCounter> = {}): UserCounter {
    return {
      publish: faker.random.number(),
      buys: faker.random.number(),
      sells: faker.random.number(),
      favorites: faker.random.number(),
      views: faker.random.number(),
      profile_favorited_received: faker.random.number(),
      profile_favorited: faker.random.number(),
      reviews: faker.random.number(),
      sold: faker.random.number(),
      reports_received: faker.random.number(),
      onHold: faker.random.number(),
      featured: faker.random.number(),
    };
  }
}
