import { LatitudeMother, LongitudeMother } from '@fixtures/core';
import { ColourMother } from '@fixtures/shared';
import { ApiUserExtrainfo, ApiUserResponse, ApiUserStatsOld, ApiUserValidations } from 'app/data/user/infrastructure/repository/api-user.response';
import * as faker from 'faker';
import { UserGenderMother, UserLocationMother } from './../../domain';

export class ApiUserResponseMother {
  static random(partial: Partial<ApiUserResponse> = {}): ApiUserResponse {
    return {
      micro_name: faker.name.firstName(),
      image: {
        average_hex_color: ColourMother.randomHex(),
        id: faker.random.uuid(),
        original_height: faker.random.number({ min: 2, max: 256 }),
        original_width: faker.random.number({ min: 2, max: 256 }),
        urls_by_size: {
          large: faker.image.imageUrl(),
          medium: faker.image.imageUrl(),
          original: faker.image.imageUrl(),
          small: faker.image.imageUrl(),
          xlarge: faker.image.imageUrl(),
          xmall: faker.image.imageUrl(),
          ...partial.image?.urls_by_size,
        },
        ...partial.image,
      },
      location: UserLocationMother.random(),
      stats: ApiUserStatsOldMother.random(partial.stats),
      validations: ApiUserValidationsMother.random(partial.validations),
      verification_level: faker.random.number(),
      scoring_stars: faker.random.number(),
      scoring_starts: faker.random.number(),
      response_rate: faker.lorem.words(),
      online: faker.random.boolean(),
      received_reports: faker.random.number(),
      type: faker.lorem.word(),
      web_slug: faker.internet.url(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      birth_date: faker.date.past().getSeconds(),
      gender: UserGenderMother.random(),
      email: faker.internet.email(),
      featured: faker.random.boolean(),
      extra_info: ApiUserExtrainfoMother.random(partial.extra_info),
      ...partial,
    };
  }
}


export class ApiUserStatsOldMother {
  static random(partial: Partial<ApiUserStatsOld> = {}): ApiUserStatsOld {
    return {
        published: faker.random.number(),
        sold: faker.random.number(),
        favorites: faker.random.number(),
        send_reviews: faker.random.number(),
        received_reviews: faker.random.number(),
        notification_read_pending: faker.random.number(),
        purchased: faker.random.number(),
      ...partial
    }
  }
}

export class ApiUserValidationsMother {
  static random(partial: Partial<ApiUserValidations> = {}): ApiUserValidations {
    return {
      email: faker.random.boolean(),
      mobile: faker.random.boolean(),
      facebook: faker.random.boolean(),
      google_plus: faker.random.boolean(),
      gender: faker.random.boolean(),
      location: faker.random.boolean(),
      picture: faker.random.boolean(),
      scoring_stars: faker.random.number(),
      level: faker.random.number(),
      birthday: faker.random.boolean(),
      ...partial
    }
  }
}

export class ApiUserExtrainfoMother {
  static random(partial: Partial<ApiUserExtrainfo> = {}): ApiUserExtrainfo {
    return {
      description: faker.lorem.sentences(),
      address: faker.address.streetAddress(),
      phone_number: faker.phone.phoneNumber(),
      link: faker.internet.url(),
      latitude: LatitudeMother.random(),
      longitude: LongitudeMother.random(),
      ...partial
    }
  }
}
