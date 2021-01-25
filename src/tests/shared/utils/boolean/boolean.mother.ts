import { random } from 'faker';

export class BooleanMother {
  static random(): boolean {
    return random.boolean();
  }
}
