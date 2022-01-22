export interface SellerRequestDto {
  id: string;
  item_hash: string;
  buyer_user_hash: string;
  buyer_address: SellerRequestBuyerAddressDto;
  created_at: string;
  fail_reason: SellerRequestPaymentAndRequestStatusDto;
  offered_price: SellerRequestCostDto;
  seller_revenue: SellerRequestRevenueDto;
  status: SellerRequestPaymentAndRequestStatusDto;
}

export interface SellerRequestBuyerAddressDto {
  city: string;
  country: string;
}

export interface SellerRequestRevenueDto {
  delivery_cost: SellerRequestCostDto;
  fees_cost: SellerRequestCostDto;
  item: SellerRequestCostDto;
  total: SellerRequestCostDto;
}

export interface SellerRequestPaymentAndRequestStatusDto {
  payment: SellerPaymentStatusDto;
  request: SellerRequestStatusDto;
}

export interface SellerRequestCostDto {
  amount: number;
  currency: string;
}

export type SellerPaymentStatusDto = 'pending' | 'ready' | 'in progress' | 'succeeded' | 'failed' | 'cancelled by buyer';
export type SellerRequestStatusDto = 'pending' | 'failed' | 'accepted' | 'rejected' | 'expired' | 'cancelled' | 'payment required';
