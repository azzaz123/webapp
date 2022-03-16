import { ImageDto, PriceDto } from '@api/core/dtos';

export enum BumpTypes {
  ZONE = 'zone',
  CITY = 'city',
  COUNTRY = 'country',
}

export interface PublishedItemDto {
  id: string;
  category_id: string;
  title: string;
  images: ImageDto[];
  price: PriceDto;
  slug?: string;
  created_date: number;
  modified_date: number;
  bump?: { type: BumpTypes };
  reserved?: { flag: boolean };
  listing_limit?: { exceeded: boolean };
}
