import { UserId } from '@data/user';
import { random } from 'faker';

export class UserIdMother {
  static random(): UserId {
    return random.uuid();
  }
}
