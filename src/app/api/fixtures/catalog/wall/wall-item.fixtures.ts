import { CatalogItemPrice, WallItem } from '@api/catalog/dtos';
import { CAR_ATTRIBUTE_TYPE, CatalogItemAttribute, REAL_ESTATE_ATTRIBUTE_TYPE } from '../../../catalog/dtos/catalog-item-attribute';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { catalogItemImageFixture, mappedCatalogItemImageFixture } from '@api/fixtures/catalog/catalog-image.fixtures';

const id = 'my-item-id';
const title = 'Title';
const description = 'Description';
const slug = 'my-slug';
const noStorytellingCategoryId = '222';
const storytellingCategoryId = '100';

const attributes: CatalogItemAttribute[] = [
  {
    title: 'Brand',
    value: 'value',
    text: 'Audi',
    type: CAR_ATTRIBUTE_TYPE.BRAND,
  },
  {
    title: 'Surface',
    value: 'value',
    text: '200',
    type: REAL_ESTATE_ATTRIBUTE_TYPE.SURFACE,
  },
  {
    title: 'Garage',
    value: 'true',
    text: 'true',
    type: REAL_ESTATE_ATTRIBUTE_TYPE.GARAGE,
  },
  {
    title: 'Pool',
    value: 'false',
    text: 'false',
    type: REAL_ESTATE_ATTRIBUTE_TYPE.POOL,
  },
];

const storytelling = 'Brand: Audi Surface: 200 Description Garage';

const price: CatalogItemPrice = {
  currency: 'EUR',
  amount: 200,
};

export const userIdFixture = 'my-user-id';
export const favouriteIdsFixture = ['my-item-id'];

export const wallItemFixture: WallItem = {
  id,
  images: [catalogItemImageFixture],
  slug,
  category_id: noStorytellingCategoryId,
  attributes,
  title,
  description,
  price,
};

export const storytellingWallItemFixture: WallItem = {
  ...wallItemFixture,
  category_id: storytellingCategoryId,
};

export const mappedWallItemFixture: ItemCard = {
  id,
  title,
  categoryId: Number.parseInt(noStorytellingCategoryId, 0),
  description,
  salePrice: price.amount,
  currencyCode: price.currency,
  webSlug: slug,
  images: [mappedCatalogItemImageFixture],
  ownerId: userIdFixture,
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
  categoryId: Number.parseInt(storytellingCategoryId, 0),
  description: storytelling,
};
