import { RECOMMENDER_TYPE } from '../enums/recomender-type.enum';
import { RecommenderItem } from './recommender-item.interface';

export interface RecommendedItemsBodyResponse {
  recommended_items: RecommenderItem[];
  recommended_type: RECOMMENDER_TYPE;
}
