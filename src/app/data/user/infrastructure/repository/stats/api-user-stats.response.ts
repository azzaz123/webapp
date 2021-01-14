
import { UserCounter, UserRating, UserStats } from './../../../domain';
export interface ApiUserStatsResponse {
  ratings: TypeValue[];
  counters: TypeValue[];
}

interface TypeValue {
  type: string;
  value: number;
}

export class ApiUserStasMapper {
  static toDomain({ratings, counters}: ApiUserStatsResponse): UserStats {
    return {
      ratings: ApiUserStatsRatingMapper.toDomain(ratings),
      counters: ApiUserStatsCounterMapper.toDomain(counters)
    }
  }
}

class ApiUserStatsRatingMapper {
  static toDomain(apiRatings: TypeValue[]): UserRating {
    return {
      reviews: apiRatings.reduce((reviews: number, {value}: TypeValue) => reviews + value, 0)
    };
  }
}

class ApiUserStatsCounterMapper {
  static toDomain(apiCounters: TypeValue[]): UserCounter {
    return apiCounters
    .reduce((partial: Partial<UserCounter>, typeValue: TypeValue) => ({...partial, [typeValue.type]: typeValue.value}), {}) as UserCounter;
  }
}

