import { UserLocation } from '@data/user';
import { LatitudeMother, LongitudeMother } from '@fixtures/core';
import { BooleanMother } from '@fixtures/shared';
import * as faker from 'faker';

export class UserLocationMother {
  static random(partial: Partial<UserLocation> = {}): UserLocation {
    return {
      approximated_latitude: LatitudeMother.random(),
      approximated_longitude: LongitudeMother.random(),
      city: faker.address.city(),
      zip: faker.address.zipCode(),
      approxRadius: faker.random.number(),
      title: faker.lorem.sentence(),
      full_address: faker.address.streetAddress(),
      approximated_location: BooleanMother.random(),
      latitude: LatitudeMother.random(),
      longitude: LongitudeMother.random(),
      address: faker.address.secondaryAddress(),
      country_code: faker.address.countryCode(),
      ...partial,
    };
  }
}
