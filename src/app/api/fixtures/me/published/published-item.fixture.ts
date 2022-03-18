import { itemImageFixture, mappedItemImageFixture } from '@api/fixtures/core/image.fixtures';
import { BumpTypes, PublishedItemDto } from '@api/me/dtos/published/response/published-item-dto';
import { Item } from '@core/item/item';
import { PURCHASES } from '@fixtures/item.fixtures.spec';

export const publishedItemFixture: PublishedItemDto = {
  id: '1',
  category_id: '32',
  title: 'Published item',
  price: {
    currency: 'EUR',
    amount: 3292,
  },
  images: [itemImageFixture],
  slug: 'slug',
  bump: { type: BumpTypes.COUNTRY },
  reserved: { flag: false },
  expired: { flag: false },
  created_date: 1638528402247,
  modified_date: 1638528403023,
  listing_limit: { exceeded: false },
};

export const mappedPublishedItemFixture: Item = new Item(
  publishedItemFixture.id,
  null,
  undefined,
  publishedItemFixture.title,
  undefined,
  Number.parseInt(publishedItemFixture.category_id),
  undefined,
  publishedItemFixture.price.amount,
  publishedItemFixture.price.currency,
  publishedItemFixture.modified_date,
  publishedItemFixture.slug,
  {
    pending: false,
    sold: false,
    favorite: false,
    reserved: publishedItemFixture.reserved?.flag,
    banned: false,
    expired: false,
    bumped: !!publishedItemFixture.bump?.type,
    bump_type: publishedItemFixture.bump?.type,
    onhold: publishedItemFixture.listing_limit.exceeded,
  },
  undefined,
  undefined,
  mappedItemImageFixture,
  [mappedItemImageFixture],
  publishedItemFixture.slug,
  publishedItemFixture.created_date
);

export const mappedPublishedItemWithBumpsFixture: Item = new Item(
  publishedItemFixture.id,
  null,
  undefined,
  publishedItemFixture.title,
  undefined,
  Number.parseInt(publishedItemFixture.category_id),
  undefined,
  publishedItemFixture.price.amount,
  publishedItemFixture.price.currency,
  publishedItemFixture.modified_date,
  publishedItemFixture.slug,
  {
    pending: false,
    sold: false,
    favorite: false,
    reserved: publishedItemFixture.reserved?.flag,
    banned: false,
    expired: false,
    bumped: PURCHASES[0].visibility_flags.bumped,
    bump_type: publishedItemFixture.bump?.type,
    onhold: publishedItemFixture.listing_limit.exceeded,
    highlighted: PURCHASES[0].visibility_flags.highlighted,
    urgent: PURCHASES[0].visibility_flags.urgent,
  },
  undefined,
  undefined,
  mappedItemImageFixture,
  [mappedItemImageFixture],
  publishedItemFixture.slug,
  publishedItemFixture.created_date
);

mappedPublishedItemWithBumpsFixture.bumpExpiringDate = PURCHASES[0].expiration_date;
