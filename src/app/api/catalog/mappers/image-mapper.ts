import { CatalogItemImage } from '../dtos/catalog-item-image';
import { Image } from '@core/user/user-response.interface';

export function mapCatalogImagesToImages(catalogImages: CatalogItemImage[]): Image[] {
  return catalogImages.map((image: CatalogItemImage) => mapCatalogImageToImage(image));
}

function mapCatalogImageToImage(image: CatalogItemImage): Image {
  const { average_color, urls } = image;
  const { big: imageBigUrl, medium: imageMediumUrl, small: imageSmallUrl } = urls;

  const httpsImageBigUrl = forceHttps(imageBigUrl);
  const httpsImageMediumUrl = forceHttps(imageMediumUrl);
  const httpsImageSmallUrl = forceHttps(imageSmallUrl);

  return {
    id: '', // TODO: Deprecated. Should be deleted from model
    original_height: 0, // TODO: Deprecated. Should be deleted from model
    original_width: 0, // TODO: Deprecated. Should be deleted from model
    average_hex_color: average_color,
    urls_by_size: {
      original: httpsImageBigUrl, // TODO: Deprecated. Should be deleted from model
      small: httpsImageSmallUrl,
      medium: httpsImageMediumUrl,
      large: httpsImageBigUrl,
      xlarge: httpsImageBigUrl, // TODO: Deprecated. Should be deleted from model
    },
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
