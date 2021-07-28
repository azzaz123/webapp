import { ATTRIBUTE_TYPE, CAR_ATTRIBUTE_TYPE, CatalogItemAttribute, REAL_ESTATE_ATTRIBUTE_TYPE } from '@api/catalog/dtos';
import { capitalizeString } from '@core/helpers/capitalize-string/capitalize-string';
import { ItemType } from '@api/core/model/item';

const STORY_TELLING_CATEGORIES: ItemType[] = [ItemType.CARS, ItemType.REAL_ESTATE];
const STORY_TELLING_UPPER_ORDERED_ATTRS: ATTRIBUTE_TYPE[] = [
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

const STORY_TELLING_LOWER_ORDERED_ATTRS: ATTRIBUTE_TYPE[] = [REAL_ESTATE_ATTRIBUTE_TYPE.TYPE, REAL_ESTATE_ATTRIBUTE_TYPE.OPERATION];

const STORY_TELLING_LOW_ORDERED_BOOLEAN_ATTRS: ATTRIBUTE_TYPE[] = [
  REAL_ESTATE_ATTRIBUTE_TYPE.GARAGE,
  REAL_ESTATE_ATTRIBUTE_TYPE.POOL,
  REAL_ESTATE_ATTRIBUTE_TYPE.ELEVATOR,
  REAL_ESTATE_ATTRIBUTE_TYPE.GARDEN,
  REAL_ESTATE_ATTRIBUTE_TYPE.TERRACE,
];

export function formatDescription(type: ItemType, description: string, attributes: CatalogItemAttribute[]): string {
  if (!STORY_TELLING_CATEGORIES.includes(type)) {
    return description;
  }

  const upperStorytelling = reduceAttrStorytelling(attributes, STORY_TELLING_UPPER_ORDERED_ATTRS);
  const lowerStoryTelling = reduceAttrStorytelling(attributes, STORY_TELLING_LOWER_ORDERED_ATTRS);
  const lowerBooleanValuedStoryTelling = reduceAttrStorytelling(attributes, STORY_TELLING_LOW_ORDERED_BOOLEAN_ATTRS, true);

  return [upperStorytelling, description, lowerStoryTelling, lowerBooleanValuedStoryTelling].filter((text) => !!text).join(' ');
}

function reduceAttrStorytelling(attributes: CatalogItemAttribute[], attrList: ATTRIBUTE_TYPE[], isBooleanValued?: boolean): string {
  return attrList
    .reduce((acc, orderedAttribute) => {
      const itemAttribute = attributes.find((attribute) => attribute.type === orderedAttribute);

      if (itemAttribute && !isBooleanValued) {
        return `${acc ? `${acc} ` : acc}${capitalizeString(itemAttribute.title)}: ${capitalizeString(itemAttribute.text)}`;
      }

      if (itemAttribute && isBooleanValued && itemAttribute.value === 'true') {
        return `${acc ? `${acc}, ` : acc}${capitalizeString(itemAttribute.title)}`;
      }

      return acc;
    }, '')
    .trim();
}
