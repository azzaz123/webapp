import { UserGender } from '@data/user';
import * as faker from 'faker';

export class UserGenderMother {
  static random(): UserGender {
    return faker.random.arrayElement([UserGender.MALE, UserGender.FEMALE]);
  }
}
