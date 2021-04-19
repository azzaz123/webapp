import { RECOMMENDER_TYPE } from '../enums/recomender-type.enum';

export interface RecommenderItem {
  category_id: number;
  currency: string;
  favorited: boolean;
  id: string;
  images: RecommenderItemImage[];
  price: number;
  seller_id: string;
  shipping_allowed: boolean;
  title: string;
  web_slug: string;
  recommended_type: RECOMMENDER_TYPE;
}

export interface RecommenderItemImage {
  large: string;
  medium: string;
  original: string;
  original_height: number;
  original_width: number;
  small: string;
  xlarge: string;
  xsmall: string;
}
