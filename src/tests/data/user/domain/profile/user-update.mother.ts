import { UserUpdate } from 'app/data/user/domain';
import * as faker from 'faker';
import { UserGenderMother } from './user-gender.mother';

export class UserUpdateMother {
  static random(partial: Partial<UserUpdate> = {}): UserUpdate {
    return {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      language_id: faker.random.uuid(),
      birth_date: faker.date.past().toUTCString(),
      gender: UserGenderMother.random(),
      ...partial,
    };
  }
}
