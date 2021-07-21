import { CatalogItemAttribute, CatalogItemImage } from '@api/catalog/dtos';
import { ItemType } from '@api/core/model/item';
import { PriceDto } from '@api/core/dtos';

export interface WallItem {
  id: string;
  category_id: number;
  type: ItemType;
  title: string;
  description: string;
  slug: string;
  distance: number;
  images: CatalogItemImage[];
  price: PriceDto;
  attributes: CatalogItemAttribute[];
  bump?: { type: string };
  reserved?: { flag: boolean };
  pro?: { flag: boolean };
}
