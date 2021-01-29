import { RECOMMENDER_TYPE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { RecommenderItem } from '@public/core/services/api/recommender/interfaces/recommender-item.interface';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';

const recommendedItem: RecommenderItem = {
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

export const recommendedItems: RecommendedItemsBodyResponse = {
  recommended_type: RECOMMENDER_TYPE.DEFAULT,
  recommended_items: [
    recommendedItem,
    recommendedItem,
    recommendedItem,
    recommendedItem,
    recommendedItem,
    recommendedItem,
  ],
};
