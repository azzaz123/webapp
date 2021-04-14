import { RECOMMENDATIONS_ENGINE } from '@public/core/services/api/recommender/enums/recomender-type.enum';

export interface RecommendedItemsInitEventEmitter {
  recommendedItemIds: string;
  engine: RECOMMENDATIONS_ENGINE;
}
