import { SearchItemImageResponse } from './search-item-image.response';
import { Image } from '@core/user/user-response.interface';

export function SearchItemImageMapper(searchImage: SearchItemImageResponse): Image {
  return {
    id: '',
    original_height: searchImage.original_height,
    original_width: searchImage.original_width,
    average_hex_color: '',
    urls_by_size: {
      original: searchImage.original,
      small: searchImage.small,
      large: searchImage.large,
      medium: searchImage.medium,
      xlarge: searchImage.xlarge,
    }
  };
}
