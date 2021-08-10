import { PublishedItem } from '@api/catalog/dtos';
import { itemImageFixture, mappedItemImageFixture } from '../../core/image.fixtures';
import { CAR_ATTRIBUTE_TYPE, CatalogItemAttribute, REAL_ESTATE_ATTRIBUTE_TYPE } from '../../../catalog/dtos/catalog-item-attribute';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { PriceDto } from '@api/core/dtos';

const id = 'my-item-id';
const title = 'Title';
const description = 'Description';
const slug = 'my-slug';
const noStorytellingCategoryId = 222;
const storytellingCategoryId = 100;

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

const price: PriceDto = {
  currency: 'EUR',
  amount: 200,
};

export const userIdFixture = 'my-user-id';
export const favouriteIdsFixture = ['my-item-id'];

export const publishedItemFixture: PublishedItem = {
  id,
  images: [itemImageFixture],
  category_id: noStorytellingCategoryId.toString(),
  slug,
  attributes,
  title,
  description,
  price,
};

export const storytellingPublishedItemFixture: PublishedItem = {
  ...publishedItemFixture,
  category_id: storytellingCategoryId.toString(),
};

export const mappedPublishedItemFixture: ItemCard = {
  id,
  categoryId: noStorytellingCategoryId,
  title,
  description,
  salePrice: price.amount,
  currencyCode: price.currency,
  webSlug: slug,
  images: [mappedItemImageFixture],
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

export const mappedFavouritedPublishedItemFixture: ItemCard = {
  ...mappedPublishedItemFixture,
  flags: {
    ...mappedPublishedItemFixture.flags,
    favorite: true,
  },
};

export const mappedStorytellingPublishedItemFixture: ItemCard = {
  ...mappedPublishedItemFixture,
  description: storytelling,
  categoryId: storytellingCategoryId,
};