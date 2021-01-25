import { random } from 'faker';

export class LatitudeMother {
  static random(): number {
    return random.number({ min: -90, max: 90 });
  }
}
