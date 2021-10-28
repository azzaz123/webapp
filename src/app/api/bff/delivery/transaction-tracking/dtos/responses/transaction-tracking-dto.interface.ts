export interface TransactionTrackingDto {
  analytics: {
    buyer_country: string;
    seller_country: string;
  };
  shipping_status: {
    actions: [
      {
        action: TransactionTrackingAction;
        state: string;
        style: string;
        title: string;
      }
    ];
    animation: {
      mode: string;
      url: string;
    };
    description: string;
    title: string;
  };
  title: string;
  top_action: {
    action: TransactionTrackingAction;
    state: string;
    style: string;
    title: string;
  };
  transaction_status_info: [
    {
      action: TransactionTrackingAction;
      action_icon: string;
      description: string;
      icon: {
        style: string;
        thumbnail_url: string;
        url: string;
      };
    }
  ];
}

interface TransactionTrackingAction {
  action_type: string;
  analytics: {
    request_id: string;
    source: string;
    user_id: string;
  };
  payload: {};
}
