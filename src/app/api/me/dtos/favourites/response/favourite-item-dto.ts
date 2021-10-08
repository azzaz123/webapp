import { ImageDto, PriceDto } from '@api/core/dtos';

export interface FavouriteItemDto {
  id: string;
  category_id: string;
  title: string;
  images: ImageDto[];
  price: PriceDto;
  slug: string;
  bump?: { type: string };
  reserved?: { flag: boolean };
  pro?: { flag: boolean };
  sold?: { flag: boolean };
  user_id: string;
}
