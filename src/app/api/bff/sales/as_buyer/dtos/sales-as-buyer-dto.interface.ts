export interface SalesAsBuyerDto {
  next_page?: number;
  sales: SaleAsBuyerDto[];
}

interface SaleAsBuyerDto {
  cost_amount: number;
  cost_currency: string;
  finished_at: number;
  id: string;
  item?: ItemSaleAsBuyerDto;
  transaction_status?: 'SUCCEEDED' | 'RETURNED' | 'CANCELLED' | 'CANCELLED_BY_SELLER' | 'EXPIRED';
  type: 'SHIPPING' | 'F2F' | ' SOLD_OUTSIDE' | 'LOCAL_PAYMENT';
  user?: UserSaleAsBuyerDto;
}

interface UserSaleAsBuyerDto {
  hash: string;
  id: string;
  image_url?: string;
}

interface ItemSaleAsBuyerDto {
  hash: string;
  id: string;
  image_url?: string;
  title: string;
}
