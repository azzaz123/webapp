interface BuyerRequestDto {
  id: string;
  item_hash: string;
  seller_user_hash: string;
  offered_price: {
    amount: number;
    currency: string;
  };
  buyer_cost: {
    item: {
      amount: number;
      currency: string;
    };
    delivery: {
      amount: number;
      currency: string;
    };
    fees: {
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
  } | null;
  status: {
    request: string;
    payment: string;
  };
  fail_reason: {
    request: string | null;
    payment: string | null;
  };
  created_at: string;
}

export type BuyerRequestsDto = BuyerRequestDto[] | [];
