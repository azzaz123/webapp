import { PriceDto } from '@api/core/dtos';

export interface BuyerRequestsItemsDetailsDto {
  category_id: number;
  item_hash: string;
  picture_url: string;
  price: PriceDto;
  seller_country: string;
  seller_user_hash: string;
  title: string;
}
