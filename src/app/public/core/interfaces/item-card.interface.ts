import { ItemFlags, ItemSaleConditions, ItemVisibilityFlags } from '@core/item/item-response.interface';
import { Image } from '@core/user/user-response.interface';
import { RECOMMENDER_TYPE } from '../services/api/recommender/enums/recomender-type.enum';

export interface ItemCard {
  id: string;
  title: string;
  description?: string;
  salePrice: number;
  currencyCode: string;
  ownerId?: string;
  webSlug: string;
  images: Image[];
  distance?: number;
  flags?: ItemFlags;
  bumpFlags?: ItemVisibilityFlags;
  categoryId?: number;
  saleConditions?: ItemSaleConditions;
  specs?: string[];
}

export interface ItemCardsWithRecommenedType {
  recommendedType: RECOMMENDER_TYPE;
  recommendedItems: ItemCard[];
}
