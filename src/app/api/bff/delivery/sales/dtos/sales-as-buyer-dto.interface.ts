export interface SalesAsBuyerDto {
  next_page: number | null;
  sales: SaleAsBuyer[];
}

interface SaleAsBuyer {
  cost_amount: number;
  cost_currency: string;
  finished_at: number;
  id: string;
  item: {
    hash: string;
    id: string;
    image_url: string;
    title: string;
  };
  transaction_status: string;
  type: string;
  user: {
    hash: string;
    id: string;
    image_url: string;
  };
}
