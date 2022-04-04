import { RECOMMENDER_TYPE } from '../enums/recomender-type.enum';
import { RecommenderItemDto } from './recommender-item.interface';

export interface RecommendedItemsBodyResponse {
  data: RecommenderItemDto[];
  meta: { recommended: { type: RECOMMENDER_TYPE } };
}
