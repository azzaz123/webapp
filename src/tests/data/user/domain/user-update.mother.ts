import { UserUpdate } from 'app/data/user/domain';
import * as faker from 'faker';
import { UserGenderMother } from './user-gender.mother';

export class UserUpdateMother {
  static random(partial: Partial<UserUpdate> = {}): UserUpdate {
    return {
      first_name: partial.first_name || faker.name.firstName(),
      last_name: partial.last_name || faker.name.lastName(),
      language_id: partial.language_id || faker.random.uuid(),
      birth_date: partial.birth_date || faker.date.past().toUTCString(),
      gender: partial.gender || UserGenderMother.random(),
    };
  }
}
