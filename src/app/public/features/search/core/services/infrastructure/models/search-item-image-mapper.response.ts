import { SearchItemImageResponse } from './search-item-image.response';
import { Image } from '@core/user/user-response.interface';

export function SearchItemImageMapper(searchImage: SearchItemImageResponse): Image {
  return {
    id: '',
    original_height: searchImage.original_height,
    original_width: searchImage.original_width,
    average_hex_color: '',
    urls_by_size: {
      original: forceHttps(searchImage.original),
      small: forceHttps(searchImage.small),
      large: forceHttps(searchImage.large),
      medium: forceHttps(searchImage.medium),
      xlarge: forceHttps(searchImage.xlarge),
    }
  };
}

function forceHttps(url: string): string {
  // TODO: This is a dirty trick to replace the protocol of the images from HTTP to HTTPS
  //       and should be changed using a better approach

  if (typeof url === 'string' && url.includes('http://')) {
    return url.replace('http://', 'https://');
  }

  return url;
}
