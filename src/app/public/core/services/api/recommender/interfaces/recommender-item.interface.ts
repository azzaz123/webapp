import { ImageDto, PriceDto } from '@api/core/dtos';

export interface RecommenderItemDto {
  id: string;
  category_id: string;
  price: PriceDto;
  favorited: { flag: boolean };
  images?: ImageDto[];
  user_id: string;
  supports_shipping: { flag: boolean };
  title: string;
  slug: string;
}
