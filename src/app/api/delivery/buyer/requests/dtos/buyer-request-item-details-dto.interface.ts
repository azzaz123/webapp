export interface BuyerRequestItemDetailsDto {
  category_id: number;
  item_hash: string;
  picture_url: string;
  price: BuyerRequestCostDto;
  seller_country: string;
  seller_user_hash: string;
  title: string;
}

interface BuyerRequestCostDto {
  amount: number;
  currency: string;
}
