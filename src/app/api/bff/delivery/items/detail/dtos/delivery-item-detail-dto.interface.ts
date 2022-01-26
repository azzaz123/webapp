export interface DeliveryItemDetailDto {
  buy_now_allowed: boolean;
  call_to_action: string;
  delivery_costs: {
    buyer_address_cost: {
      amount: number;
      currency: string;
    };
    carrier_office_cost: {
      amount: number;
      currency: string;
    };
  } | null;
  delivery_times: {
    from: number;
    to: number;
  } | null;
  shippable: boolean;
  shipping_allowed: boolean;
  shipping_banner_enabled: boolean;
}
