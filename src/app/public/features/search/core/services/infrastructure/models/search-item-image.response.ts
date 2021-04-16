import { Image } from '@core/user/user-response.interface';

export interface SearchItemImageResponse {
  large: string;
  medium: string;
  original: string;
  original_height: number;
  original_width: number;
  small: string;
  xlarge: string;
  xsmall: string;
}

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
