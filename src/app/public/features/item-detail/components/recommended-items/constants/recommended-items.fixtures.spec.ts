import { Item } from '@core/item/item';
import { Image } from '@core/user/user-response.interface';
import { RECOMMENDER_TYPE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { RecommenderItem } from '@public/core/services/api/recommender/interfaces/recommender-item.interface';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';

const urlImage = 'http://localhost:6006/images/item-camera.jpg';
export const RECOMMENDED_ITEM_MOCK: RecommenderItem = {
  category_id: 100,
  currency: 'EUR',
  favorited: true,
  id: '34342',
  images: [
    {
      large: urlImage,
      medium: urlImage,
      original: urlImage,
      original_height: null,
      original_width: null,
      small: urlImage,
      xlarge: urlImage,
      xsmall: urlImage,
    },
  ],
  price: 96000,
  seller_id: '12323',
  shipping_allowed: false,
  title: 'Title',
  web_slug: 'slug',
};

export const RECOMMENDED_ITEM_MOCK_WITHOUT_IMAGES: RecommenderItem = {
  category_id: 100,
  currency: 'EUR',
  favorited: true,
  id: '34342',
  images: [],
  price: 96000,
  seller_id: '12323',
  shipping_allowed: false,
  title: 'Title',
  web_slug: 'slug',
};

export const RECOMMENDED_ITEMS_MOCK: RecommendedItemsBodyResponse = {
  recommended_type: RECOMMENDER_TYPE.DEFAULT,
  recommended_items: [
    RECOMMENDED_ITEM_MOCK,
    RECOMMENDED_ITEM_MOCK,
    RECOMMENDED_ITEM_MOCK,
    RECOMMENDED_ITEM_MOCK,
    RECOMMENDED_ITEM_MOCK,
    RECOMMENDED_ITEM_MOCK,
  ],
};

export const EMPTY_RECOMMENDED_ITEMS_MOCK: RecommendedItemsBodyResponse = {
  recommended_type: RECOMMENDER_TYPE.DEFAULT,
  recommended_items: [],
};

const RECOMMENDED_ITEM_IMAGE: Image = {
  id: '2',
  original_width: null,
  original_height: null,
  average_hex_color: '',
  urls_by_size: {
    original: urlImage,
    small: urlImage,
    large: urlImage,
    medium: urlImage,
    xlarge: urlImage,
  },
};

export const MAPPED_RECOMMENDED_ITEM_MOCK: Item = new Item(
  RECOMMENDED_ITEM_MOCK.id,
  null,
  RECOMMENDED_ITEM_MOCK.seller_id,
  RECOMMENDED_ITEM_MOCK.title,
  null,
  RECOMMENDED_ITEM_MOCK.category_id,
  null,
  RECOMMENDED_ITEM_MOCK.price,
  RECOMMENDED_ITEM_MOCK.currency,
  null,
  null,
  {
    pending: null,
    sold: null,
    favorite: RECOMMENDED_ITEM_MOCK.favorited,
    reserved: null,
    banned: null,
    expired: null,
  },
  null,
  {
    fix_price: null,
    exchange_allowed: null,
    shipping_allowed: RECOMMENDED_ITEM_MOCK.shipping_allowed,
  },
  RECOMMENDED_ITEM_IMAGE,
  [RECOMMENDED_ITEM_IMAGE],
  RECOMMENDED_ITEM_MOCK.web_slug,
  null,
  null,
  RECOMMENDED_ITEMS_MOCK.recommended_type
);

export const RECOMMENDED_ITEM_IDS_MOCK: string = [
  RECOMMENDED_ITEM_MOCK.id,
  RECOMMENDED_ITEM_MOCK.id + '1',
  RECOMMENDED_ITEM_MOCK.id + '2',
].toString();
