import { UserGender } from '@data/user';
import { random } from 'faker';

export class UserGenderMother {
  static random(): UserGender {
    return random.arrayElement([UserGender.MALE, UserGender.FEMALE]);
  }
}
