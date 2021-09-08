import { CatalogItemAttribute } from '@api/catalog/dtos';
import { ItemType } from '@api/core/model/item';
import { ImageDto, PriceDto } from '@api/core/dtos';

export interface WallItem {
  id: string;
  category_id: number;
  type: ItemType;
  title: string;
  description: string;
  slug: string;
  distance: number;
  images: ImageDto[];
  price: PriceDto;
  attributes: CatalogItemAttribute[];
  bump?: { type?: string };
  reserved?: { flag: boolean };
  pro?: { flag: boolean };
}
