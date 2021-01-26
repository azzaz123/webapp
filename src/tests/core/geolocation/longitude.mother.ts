import { random } from 'faker';

export class LongitudeMother {
  static random(): number {
    return random.number({ min: -180, max: 180 });
  }
}
