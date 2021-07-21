import { CatalogItemAttribute, CatalogItemImage } from '@api/catalog/dtos';
import { PriceDto } from '@api/core/dtos';

export interface PublishedItem {
  id: string;
  category_id: string;
  title: string;
  description: string;
  images: CatalogItemImage[];
  price: PriceDto;
  attributes: CatalogItemAttribute[];
  slug: string;
  reserved?: { flag: boolean };
  bump?: { type: string };
}
