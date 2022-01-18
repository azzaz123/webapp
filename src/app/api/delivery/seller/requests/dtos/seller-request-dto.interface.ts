export interface SellerRequestDto {
  id: string;
  item_hash: string;
  buyer_user_hash: string;
  buyer_address: { city: string; country: string };
  created_at: string;
  fail_reason: { payment: SellerPaymentStatusDto; request: SellerRequestStatusDto };
  offered_price: SellerRequestCostDto;
  seller_revenue: {
    delivery_cost: SellerRequestCostDto;
    fees_cost: SellerRequestCostDto;
    item: SellerRequestCostDto;
    total: SellerRequestCostDto;
  };
  status: { payment: SellerPaymentStatusDto; request: SellerRequestStatusDto };
}

interface SellerRequestCostDto {
  amount: number;
  currency: string;
}

type SellerPaymentStatusDto = 'pending' | 'ready' | 'in progress' | 'succeeded' | 'failed' | 'cancelled by buyer';
type SellerRequestStatusDto = 'pending' | 'failed' | 'accepted' | 'rejected' | 'expired' | 'cancelled' | 'payment required';
