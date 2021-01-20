import { ApiUserStatsResponse, TypeValue } from 'app/data/user/infrastructure/repository/stats/api-user-stats.response';
import * as faker from 'faker'

export class ApiUserStatsResponseMother {
  static random(partial: Partial<ApiUserStatsResponse> = {}): ApiUserStatsResponse {
    return {
      ratings: TypeValueMother.randomList(),
      counters: TypeValueMother.randomList(),
      ...partial
    };
  }
}

class TypeValueMother {
  static randomList(count: number = faker.random.number({min: 0, max: 50})): TypeValue[] {
    return new Array(count).fill('').map(TypeValueMother.random);
  }

  static random(partial: Partial<TypeValue> = {}): TypeValue {
    return {
      type: faker.lorem.word(),
      value: faker.random.number(),
      ...partial
    };
  }
}
