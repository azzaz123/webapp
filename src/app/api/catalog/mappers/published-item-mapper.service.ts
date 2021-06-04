import { AbstractMapperService } from '../../core/mapper/abstract-mapper.service';
import { CatalogItem } from '../dtos/catalog-item';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { CatalogItemAttribute } from '../dtos/catalog-item-attribute';
import { Injectable } from '@angular/core';
import { ImageMapperService } from './image-mapper.service';

@Injectable()
export class PublishedItemMapperService extends AbstractMapperService<CatalogItem, ItemCard> {
  constructor(private imageMapperService: ImageMapperService) {
    super();
  }

  protected map(item: CatalogItem): ItemCard {
    const { id, title, description, price, images = [], attributes = [], slug } = item;

    return {
      id,
      title,
      description: this.formatStorytellingDescription(description, attributes),
      salePrice: price.amount,
      currencyCode: price.currency,
      webSlug: slug,
      images: this.imageMapperService.transform(images),
      ownerId: '', // BEFOREMERGE: Check behaviour for this flag
    };
  }

  private formatStorytellingDescription(description: string, attributes: CatalogItemAttribute[]): string {
    return description;
  }
}
