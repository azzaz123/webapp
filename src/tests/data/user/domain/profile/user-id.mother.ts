import { UserId } from 'app/data/user/domain';
import { random } from 'faker';

export class UserIdMother {
  static random(): UserId {
    return random.uuid();
  }
}
