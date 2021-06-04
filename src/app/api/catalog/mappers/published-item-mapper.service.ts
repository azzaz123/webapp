import { AbstractMapperService } from '../../core/mapper/abstract-mapper.service';
import { CatalogItem } from '../dtos/catalog-item';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { ATTRIBUTE_TYPE, CAR_ATTRIBUTE_TYPE, CatalogItemAttribute, REAL_ESTATE_ATTRIBUTE_TYPE } from '../dtos/catalog-item-attribute';
import { Injectable } from '@angular/core';
import { ImageMapperService } from './image-mapper.service';
import { capitalizeString } from '@core/helpers/capitalize-string/capitalize-string';

@Injectable()
export class PublishedItemMapperService extends AbstractMapperService<CatalogItem, ItemCard> {
  private STORY_TELLING_UPPER_ORDERED_ATTRS: ATTRIBUTE_TYPE[] = [
    CAR_ATTRIBUTE_TYPE.BRAND,
    CAR_ATTRIBUTE_TYPE.MODEL,
    CAR_ATTRIBUTE_TYPE.YEAR,
    CAR_ATTRIBUTE_TYPE.KM,
    CAR_ATTRIBUTE_TYPE.ENGINE,
    CAR_ATTRIBUTE_TYPE.GEARBOX,
    CAR_ATTRIBUTE_TYPE.BODY_TYPE,
    CAR_ATTRIBUTE_TYPE.SEATS,
    CAR_ATTRIBUTE_TYPE.DOORS,
    CAR_ATTRIBUTE_TYPE.HORSEPOWER,

    REAL_ESTATE_ATTRIBUTE_TYPE.SURFACE,
    REAL_ESTATE_ATTRIBUTE_TYPE.ROOMS,
    REAL_ESTATE_ATTRIBUTE_TYPE.BATHROOMS,
    REAL_ESTATE_ATTRIBUTE_TYPE.CONDITION,
  ];

  private STORY_TELLING_LOWER_ORDERED_ATTRS: ATTRIBUTE_TYPE[] = [REAL_ESTATE_ATTRIBUTE_TYPE.TYPE, REAL_ESTATE_ATTRIBUTE_TYPE.OPERATION];

  private STORY_TELLING_LOW_ORDERED_BOOLEAN_ATTRS: ATTRIBUTE_TYPE[] = [
    REAL_ESTATE_ATTRIBUTE_TYPE.GARAGE,
    REAL_ESTATE_ATTRIBUTE_TYPE.POOL,
    REAL_ESTATE_ATTRIBUTE_TYPE.ELEVATOR,
    REAL_ESTATE_ATTRIBUTE_TYPE.GARDEN,
    REAL_ESTATE_ATTRIBUTE_TYPE.TERRACE,
  ];

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
    const upperStorytelling = this.reduceAttrStorytelling(attributes, this.STORY_TELLING_UPPER_ORDERED_ATTRS);
    const lowerStoryTelling = this.reduceAttrStorytelling(attributes, this.STORY_TELLING_LOWER_ORDERED_ATTRS);
    const lowerBooleanValuedStoryTelling = this.reduceAttrStorytelling(attributes, this.STORY_TELLING_LOW_ORDERED_BOOLEAN_ATTRS, true);

    return `${upperStorytelling} ${description} ${lowerStoryTelling} ${lowerBooleanValuedStoryTelling}`;
  }

  private reduceAttrStorytelling(attributes: CatalogItemAttribute[], attrList: ATTRIBUTE_TYPE[], isBooleanValued?: boolean): string {
    return attrList
      .reduce((acc, orderedAttribute) => {
        const itemAttribute = attributes.find((attribute) => attribute.type === orderedAttribute);

        if (itemAttribute && !isBooleanValued) {
          return `${acc} ${capitalizeString(itemAttribute.title)}: ${capitalizeString(itemAttribute.text)}`;
        }

        if (itemAttribute && isBooleanValued) {
          return `${acc ? `${acc},` : acc} ${capitalizeString(itemAttribute.title)}`;
        }

        return acc;
      }, '')
      .trim();
  }
}
