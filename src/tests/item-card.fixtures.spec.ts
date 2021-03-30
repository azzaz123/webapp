import { Image } from '@core/user/user-response.interface';
import { RECOMMENDED_ITEM_MOCK } from '@public/features/item-detail/components/recommended-items/constants/recommended-items.fixtures.spec';
import { ItemCard } from '@public/shared/components/item-card/interfaces/item-card.interface';
import { ITEM_BUMP_FLAGS, ITEM_DATA } from './item.fixtures.spec';
import { USER_ID } from './user.fixtures.spec';

export const MOCK_ITEM_CARD: ItemCard = {
  id: ITEM_DATA.id,
  ownerId: USER_ID,
  title: ITEM_DATA.title,
  description: ITEM_DATA.description,
  salePrice: ITEM_DATA.sale_price,
  mainImage: ITEM_DATA.main_image,
  flags: ITEM_DATA.flags,
  bumpFlags: ITEM_BUMP_FLAGS,
  webSlug: ITEM_DATA.web_slug,
};

export const MOCK_RECOMMENDED_ITEM_CARD_IMAGE: Image = {
  id: '1213',
  original_width: RECOMMENDED_ITEM_MOCK.images[0].original_width,
  original_height: RECOMMENDED_ITEM_MOCK.images[0].original_height,
  average_hex_color: '',
  urls_by_size: {
    original: RECOMMENDED_ITEM_MOCK.images[0].original,
    small: RECOMMENDED_ITEM_MOCK.images[0].small,
    large: RECOMMENDED_ITEM_MOCK.images[0].large,
    medium: RECOMMENDED_ITEM_MOCK.images[0].medium,
    xlarge: RECOMMENDED_ITEM_MOCK.images[0].xlarge,
  },
};

export const MOCK_RECOMMENDED_ITEM_CARD: ItemCard = {
  id: RECOMMENDED_ITEM_MOCK.id,
  ownerId: RECOMMENDED_ITEM_MOCK.seller_id,
  title: RECOMMENDED_ITEM_MOCK.title,
  salePrice: RECOMMENDED_ITEM_MOCK.price,
  mainImage: MOCK_RECOMMENDED_ITEM_CARD_IMAGE,
  webSlug: RECOMMENDED_ITEM_MOCK.web_slug,
};

export const MOCK_RECOMMENDED_ITEM_CARD_WITHOUT_IMAGES: ItemCard = {
  id: RECOMMENDED_ITEM_MOCK.id,
  ownerId: RECOMMENDED_ITEM_MOCK.seller_id,
  title: RECOMMENDED_ITEM_MOCK.title,
  salePrice: RECOMMENDED_ITEM_MOCK.price,
  mainImage: null,
  webSlug: RECOMMENDED_ITEM_MOCK.web_slug,
};
