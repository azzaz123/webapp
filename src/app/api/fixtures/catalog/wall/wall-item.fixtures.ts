import { CatalogItemAttributes, WallItem } from '@api/catalog/dtos';
import { CAR_ATTRIBUTE_TYPE, REAL_ESTATE_ATTRIBUTE_TYPE } from '../../../catalog/dtos/catalog-item-attribute-data';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { itemImageFixture, mappedItemImageFixture } from '@api/fixtures/core/image.fixtures';
import { ItemType } from '@api/core/model';
import { PriceDto } from '@api/core/dtos';

const id = 'my-item-id';
const title = 'Title';
const description = 'Description';
const slug = 'my-slug';

const attributes: CatalogItemAttributes = {
  [CAR_ATTRIBUTE_TYPE.BRAND]: {
    title: 'Brand',
    value: 'value',
    text: 'Audi',
  },
  [REAL_ESTATE_ATTRIBUTE_TYPE.SURFACE]: {
    title: 'Surface',
    value: 'value',
    text: '200',
  },
  [REAL_ESTATE_ATTRIBUTE_TYPE.GARAGE]: {
    title: 'Garage',
    value: 'true',
    text: 'true',
  },
  [REAL_ESTATE_ATTRIBUTE_TYPE.POOL]: {
    title: 'Pool',
    value: 'false',
    text: 'false',
  },
};

const storytelling = 'Brand: Audi Surface: 200 Description Garage';

const price: PriceDto = {
  currency: 'EUR',
  amount: 200,
};

export const userIdFixture = 'my-user-id';
export const favouriteIdsFixture = ['my-item-id'];

export const wallItemFixture: WallItem = {
  id,
  category_id: 0,
  images: [itemImageFixture],
  type: ItemType.CONSUMER_GOODS,
  slug,
  type_attributes: attributes,
  title,
  description,
  price,
  distance: 0,
};

export const storytellingWallItemFixture: WallItem = {
  ...wallItemFixture,
  type: ItemType.CARS,
};

export const mappedWallItemFixture: ItemCard = {
  id,
  categoryId: wallItemFixture.category_id,
  title,
  description,
  salePrice: price.amount,
  currencyCode: price.currency,
  webSlug: slug,
  images: [mappedItemImageFixture],
  flags: {
    pending: false,
    sold: false,
    expired: false,
    banned: false,
    reserved: false,
    favorite: false,
    bumped: false,
  },
};

export const mappedFavouritedWallItemFixture: ItemCard = {
  ...mappedWallItemFixture,
  flags: {
    ...mappedWallItemFixture.flags,
    favorite: true,
  },
};

export const mappedStorytellingWallItemFixture: ItemCard = {
  ...mappedWallItemFixture,
  description: storytelling,
};
