import { CatalogItemAttribute } from '@api/catalog/dtos';
import { ImageDto, PriceDto } from '@api/core/dtos';

export interface PublishedItem {
  id: string;
  category_id: string;
  title: string;
  description: string;
  images: ImageDto[];
  price: PriceDto;
  attributes: CatalogItemAttribute[];
  slug: string;
  reserved?: { flag: boolean };
  bump?: { type: string };
}
