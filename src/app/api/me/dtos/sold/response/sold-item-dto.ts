import { ImageDto, PriceDto } from '@api/core/dtos';

export interface SoldItemDto {
  id: string;
  category_id: string;
  title: string;
  images: ImageDto[];
  price: PriceDto;
  slug: string;
  created_date: number;
  modified_date: number;
}
