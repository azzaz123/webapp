import { itemImageFixture, mappedItemImageFixture } from '@api/fixtures/core/image.fixtures';
import { Item } from '@core/item/item';
import { SoldItemDto } from '@api/me/dtos/sold/response/sold-item-dto';

export const soldItemFixture: SoldItemDto = {
  id: '39',
  category_id: '32',
  title: 'Sold item',
  price: {
    currency: 'EUR',
    amount: 3292,
  },
  images: [itemImageFixture],
  slug: 'slug',
  created_date: 1638528402247,
  modified_date: 1638528403023,
};

export const mappedSoldItemFixture: Item = new Item(
  soldItemFixture.id,
  null,
  null,
  soldItemFixture.title,
  undefined,
  Number.parseInt(soldItemFixture.category_id),
  undefined,
  soldItemFixture.price.amount,
  soldItemFixture.price.currency,
  soldItemFixture.modified_date,
  soldItemFixture.slug,
  {
    pending: false,
    sold: true,
    favorite: false,
    reserved: false,
    banned: false,
    expired: false,
    bumped: false,
    bump_type: null,
  },
  undefined,
  undefined,
  mappedItemImageFixture,
  [mappedItemImageFixture],
  soldItemFixture.slug,
  soldItemFixture.created_date
);
