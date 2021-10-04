export interface SubscriptionSlotGeneralResponse {
  slots: SubscriptionSlotResponse[];
}

export interface SubscriptionSlotResponse {
  type: SUBSCRIPTION_CATEGORY_TYPES;
  available: number;
  limit: number;
}

enum SUBSCRIPTION_CATEGORY_TYPES {
  CARS = 'CARS',
  MOTORBIKES = 'MOTORBIKES',
  CAR_PARTS = 'CARPARTS',
  REAL_ESTATE = 'REALESTATE',
  CONSUMER_GOODS = 'CONSUMERGOODS',
  OLD_CONSUMER_GOODS = 'OLD_CONSUMERGOODS',
}
