import { CatalogItemAttributes } from '@api/catalog/dtos';
import { ImageDto, PriceDto } from '@api/core/dtos';

export interface PublishedItemDto {
  id: string;
  category_id: string;
  title: string;
  description: string;
  images: ImageDto[];
  price: PriceDto;
  type_attributes: CatalogItemAttributes;
  slug: string;
  reserved?: { flag: boolean };
  favorited?: { flag: boolean };
  bump?: { type: string };
}
