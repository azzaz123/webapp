import { AbstractMapperService } from '../../core/mapper/abstract-mapper.service';
import { CatalogItemImage } from '../dtos/catalog-item-image';
import { Image } from '@core/user/user-response.interface';
import { Injectable } from '@angular/core';

@Injectable()
export class ImageMapperService extends AbstractMapperService<CatalogItemImage, Image> {
  protected map(image: CatalogItemImage): Image {
    const { average_color, urls } = image;
    const { big: imageBigUrl, medium: imageMediumUrl, small: imageSmallUrl } = urls;
    return {
      id: '', // TODO: Deprecated. Should be deleted from model
      original_height: 0, // TODO: Deprecated. Should be deleted from model
      original_width: 0, // TODO: Deprecated. Should be deleted from model
      average_hex_color: average_color,
      urls_by_size: {
        original: imageBigUrl, // TODO: Deprecated. Should be deleted from model
        small: imageSmallUrl,
        medium: imageMediumUrl,
        large: imageBigUrl,
        xlarge: imageBigUrl, // TODO: Deprecated. Should be deleted from model
      },
    };
  }
}
