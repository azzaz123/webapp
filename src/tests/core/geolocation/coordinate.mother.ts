import { Coordinate } from '@core/geolocation/address-response.interface';
import * as faker from 'faker';
import { LatitudeMother } from './latitude.mother';
import { LongitudeMother } from './longitude.mother';

export class CoordinateMother {
  static random(partial: Partial<Coordinate> = {}): Coordinate {
    return {
      latitude: LatitudeMother.random(),
      longitude: LongitudeMother.random(),
      name: faker.name.lastName(),
      approximated_location: faker.random.boolean(),
      ...partial,
    };
  }
}
