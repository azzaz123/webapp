import { FavouriteItemDto } from '@api/me/dtos/favourites/response/favourite-item-dto';
import { itemImageFixture, mappedItemImageFixture } from '@api/fixtures/core/image.fixtures';
import { Item } from '@core/item/item';

export const favouriteItemFixture: FavouriteItemDto = {
  id: '39',
  category_id: '32',
  title: 'Favourite item',
  price: {
    currency: 'EUR',
    amount: 3292,
  },
  images: [itemImageFixture],
  slug: 'slug',
  bump: { type: 'country' },
  sold: { flag: false },
  pro: { flag: false },
  reserved: { flag: false },
};

export const mappedFavouriteItemFixture: Item = new Item(
  favouriteItemFixture.id,
  null,
  null,
  favouriteItemFixture.title,
  undefined,
  Number.parseInt(favouriteItemFixture.category_id),
  undefined,
  favouriteItemFixture.price.amount,
  favouriteItemFixture.price.currency,
  undefined,
  favouriteItemFixture.slug,
  {
    pending: false,
    sold: favouriteItemFixture.sold?.flag,
    favorite: true,
    reserved: favouriteItemFixture.reserved?.flag,
    banned: false,
    expired: false,
    bumped: !!favouriteItemFixture.bump?.type,
    bump_type: favouriteItemFixture.bump?.type,
  },
  undefined,
  undefined,
  mappedItemImageFixture,
  [mappedItemImageFixture],
  favouriteItemFixture.slug
);

mappedFavouriteItemFixture.favorited = true;
