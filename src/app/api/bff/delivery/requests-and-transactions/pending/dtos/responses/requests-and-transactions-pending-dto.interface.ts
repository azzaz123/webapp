export interface RequestsAndTransactionsPendingDto {
  requests:
    | [
        {
          buyer_user_hash: string;
          buyer_user_image: string;
          buyer_user_name: string;
          fail_reason: string;
          id: string;
          item_cost: {
            amount: number;
            currency: string;
          };
          item_hash: string;
          item_image: string;
          item_name: string;
          seller_user_hash: string;
          seller_user_image: string;
          seller_user_name: string;
          status: string;
        }
      ]
    | [];
  transactions:
    | [
        {
          buyer_user_hash: string;
          buyer_user_image: string;
          buyer_user_name: string;
          carrier: string;
          carrier_delivery_mode: string;
          carrier_drop_off_mode: string;
          delivery_status: string;
          dispute_status: string;
          id: string;
          item_cost: {
            amount: number;
            currency: string;
          };
          item_hash: string;
          item_image: string;
          item_name: string;
          kyc_status: string;
          payment_error: string;
          payment_status: string;
          seller_user_hash: string;
          seller_user_image: string;
          seller_user_name: string;
          status: string;
          request_id: string;
        }
      ]
    | [];
}
