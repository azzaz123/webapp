import { Image } from '@core/user/user-response.interface';
import { RECOMMENDER_TYPE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { RecommenderItemDto } from '@public/core/services/api/recommender/interfaces/recommender-item.interface';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';

const urlImage = 'https://localhost:6006/images/item-camera.jpg';
export const RECOMMENDED_ITEM_MOCK: RecommenderItemDto = {
  category_id: '100',
  favorited: { flag: true },
  id: '34342',
  images: [
    {
      average_color: '',
      urls: {
        big: urlImage,
        medium: urlImage,
        small: urlImage,
      },
    },
  ],
  price: { amount: 96000, currency: 'EUR' },
  user_id: '12323',
  supports_shipping: { flag: false },
  title: 'Title',
  slug: 'slug',
};

export const RECOMMENDED_ITEM_NON_FAVOURITED_MOCK: RecommenderItemDto = {
  ...RECOMMENDED_ITEM_MOCK,
  favorited: { flag: false },
};

export const RECOMMENDED_ITEM_MOCK_WITHOUT_IMAGES: RecommenderItemDto = {
  category_id: '100',
  favorited: { flag: true },
  id: '34342',
  price: { amount: 96000, currency: 'EUR' },
  user_id: '12323',
  supports_shipping: { flag: false },
  title: 'Title',
  slug: 'slug',
};

export const RECOMMENDED_ITEMS_MOCK: RecommendedItemsBodyResponse = {
  data: [
    RECOMMENDED_ITEM_MOCK,
    RECOMMENDED_ITEM_MOCK,
    RECOMMENDED_ITEM_MOCK,
    RECOMMENDED_ITEM_MOCK,
    RECOMMENDED_ITEM_MOCK,
    RECOMMENDED_ITEM_MOCK,
  ],
  meta: { recommended: { type: RECOMMENDER_TYPE.MORE_LIKE_THIS } },
};

export const EMPTY_RECOMMENDED_ITEMS_MOCK: RecommendedItemsBodyResponse = {
  data: [],
  meta: { recommended: { type: RECOMMENDER_TYPE.MORE_LIKE_THIS } },
};

export const RECOMMENDED_ITEM_IMAGE: Image = {
  id: '',
  original_width: 0,
  original_height: 0,
  average_hex_color: '',
  urls_by_size: {
    original: urlImage,
    small: urlImage,
    large: urlImage,
    medium: urlImage,
    xlarge: urlImage,
  },
};

export const RECOMMENDED_ITEM_IDS_MOCK: string = [
  RECOMMENDED_ITEM_MOCK.id,
  RECOMMENDED_ITEM_MOCK.id + '1',
  RECOMMENDED_ITEM_MOCK.id + '2',
].toString();
