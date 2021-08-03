import { Image } from '@core/user/user-response.interface';
import { ImageDto } from '@api/core/dtos';

const bigImage = 'https://big-image.com';
const mediumImage = 'https://medium-image.com';
const smallImage = 'https://small-image.com';
const averageColor = '#000000';

export const itemImageFixture: ImageDto = {
  urls: {
    big: bigImage,
    medium: mediumImage,
    small: smallImage,
  },
  average_color: averageColor,
};

export const mappedItemImageFixture: Image = {
  id: '',
  original_height: 0,
  original_width: 0,
  average_hex_color: averageColor,
  urls_by_size: {
    original: bigImage,
    xlarge: bigImage,
    large: bigImage,
    medium: mediumImage,
    small: smallImage,
  },
};
