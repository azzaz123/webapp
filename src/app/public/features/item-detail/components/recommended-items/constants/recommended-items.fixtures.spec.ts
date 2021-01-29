import { RECOMMENDER_TYPE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { RecommenderItem } from '@public/core/services/api/recommender/interfaces/recommender-item.interface';
import { RecommendedItemsBodyResponse } from '@public/core/services/api/recommender/interfaces/recommender-response.interface';

const urlImage = 'http://localhost:6006/images/item-camera.jpg';
const recommendedItem: RecommenderItem = {
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
