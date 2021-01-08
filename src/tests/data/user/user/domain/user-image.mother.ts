import { UserImage } from '@data/user';
import { ColourMother } from '@tests/shared';
import * as faker from 'faker';

export class UserImageMother {
  static random(image: Partial<UserImage>): UserImage {
    return {
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
      },
    };
  }
}
