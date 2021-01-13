import { UserLocation } from '@data/user';
import { UserIdMother } from '../profile/user-id.mother';

import * as faker from 'faker';

export class UserLocationMother {
  static random(partial: Partial<UserLocation> = {}): UserLocation {
    return {
      id: faker.random.number(),
      approximated_latitude: faker.random.number({ min: -90, max: 90 }),
      approximated_longitude: faker.random.number({ min: -180, max: 180 }),
      city: faker.address.city(),
      zip: faker.address.zipCode(),
      approxRadius: faker.random.number(),
      title: faker.lorem.sentence(),
      full_address: faker.address.streetAddress(),
      approximated_location: faker.random.boolean(),
      latitude: faker.random.number({ min: -90, max: 90 }),
      longitude: faker.random.number({ min: -180, max: 180 }),
      address: faker.address.secondaryAddress(),
      ...partial,
    };
  }
}
