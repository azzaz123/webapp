export interface SellerRequestAcceptPostOfficeDropOffDto {
  buyer_address: {
    city: string;
    country: string;
    region: string;
  };
  buyer_cost: {
    delivery: {
      amount: number;
      currency: string;
    };
    fees: {
      amount: number;
      currency: string;
    };
    item: {
      amount: number;
      currency: string;
    };
    total: {
      amount: number;
      currency: string;
    };
  };
  buyer_cost_promotion: {
    delivery_cost_discount_percentage: number;
    fees_discount_percentage: number;
    original_buyer_cost: {
      delivery: {
        amount: number;
        currency: string;
      };
      fees: {
        amount: number;
        currency: string;
      };
      item: {
        amount: number;
        currency: string;
      };
      total: {
        amount: number;
        currency: string;
      };
    };
  };
  buyer_user_hash_id: string;
  carrier_tag: string;
  created_at: string;
  deliver_to_carrier_deadline_date: string;
  fail_reason: {
    delivery: string | null;
    payment: string | null;
    transaction: string | null;
  };
  id: string;
  item_hash_id: string;
  item_price: {
    amount: number;
    currency: string;
  };
  request_id: string;
  seller_address: {
    city: string;
    country: string;
    region: string;
  };
  seller_revenue: {
    delivery_cost: {
      amount: number;
      currency: string;
    };
    fees_cost: {
      amount: number;
      currency: string;
    };
    item: {
      amount: number;
      currency: string;
    };
    total: {
      amount: number;
      currency: string;
    };
  };
  seller_user_hash_id: string;
  status: {
    delivery: string;
    payment: string;
    transaction: string;
  };
}
