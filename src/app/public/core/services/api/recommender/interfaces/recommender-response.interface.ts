import { RECOMMENDER_TYPE } from '../enums/recomender-type.enum';
import { RecommenderItem } from './recommender-item.interface';

export interface RecommendedItemsBodyResponse {
  data: RecommenderItem[];
  meta: { recommended: { type: RECOMMENDER_TYPE } };
}
