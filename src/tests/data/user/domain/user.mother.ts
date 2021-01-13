import * as faker from 'faker';
import { UserIdMother } from './user-id.mother';
import { UserGenderMother } from './user-gender.mother';
import { UserImageMother } from './user-image.mother';
import { User } from '@data/user';

export class UserMother {
  static random(partial: Partial<User> = {}): User {
    return {
      id: UserIdMother.random(),
      microName: faker.name.firstName(),
      image: UserImageMother.random(partial.image),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      birthDate: faker.date.past().getUTCSeconds(),
      gender: UserGenderMother.random(),
      email: faker.internet.email(),
      ...partial,
    };
  }
}
