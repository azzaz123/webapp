import { UserGenderMother } from './user-gender.mother';
import { User } from '@data/user';
import * as faker from 'faker';
import { UserImageMother } from './user-image.mother';

export class UserMother {
  static random(user: Partial<User> = {}): User {
    return {
      id: user.id || faker.random.uuid(),
      microName: user.microName || faker.name.firstName(),
      image: UserImageMother.random(user.image),
      firstName: user.firstName || faker.name.firstName(),
      lastName: user.lastName || faker.name.lastName(),
      birthDate: user.birthDate || faker.date.past().getUTCSeconds(),
      gender: user.gender || UserGenderMother.random(),
      email: user.email || faker.internet.email(),
    };
  }
}
