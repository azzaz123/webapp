import { SubscriptionResponse, SubscriptionsResponse } from '../app/core/subscriptions/subscriptions.interface';

export const SUBSCRIPTIONS: SubscriptionsResponse[] = 
[
  {
    category_id: 100, 
    current_limit: 2,
    subscribed_from: null,
    selected_tier_id: null,
    default_tier_id: 2,
    tiers:
    [
      {
        id: 1,
        limit: 5,
        price: 9.99,
        currency: '€'
      }, 
      {
        id: 2,
        limit: 10,
        price: 25.85,
        currency: '€'
      },
      {
        id: 3,
        limit: 15,
        price: 35.85,
        currency: '€'
      },
      {
        id: 4,
        limit: 20,
        price: 44.85,
        currency: '€'
      },
      {
        id: 5,
        limit: 25,
        price: 55.85,
        currency: '€'
      },
      {
        id: 6,
        limit: -1,
        price: 105.85,
        currency: '€'
      }
    ]
  },
  {
    category_id: 200, 
    current_limit: 1,
    subscribed_from: null,
    selected_tier_id: null,
    default_tier_id: 1,
    tiers:
    [
      {
        id: 1,
        limit: 5,
        price: 29.99,
        currency: '€'
      }, 
      {
        id: 2,
        limit: 10,
        price: 25.85,
        currency: '€'
      },
      {
        id: 3,
        limit: 15,
        price: 35.85,
        currency: '€'
      },
      {
        id: 4,
        limit: 20,
        price: 44.85,
        currency: '€'
      },
      {
        id: 5,
        limit: 25,
        price: 55.85,
        currency: '€'
      },
      {
        id: 6,
        limit: -1,
        price: 105.85,
        currency: '€'
      }
    ]
  },
  {
    category_id: 14000, 
    current_limit: 3,
    subscribed_from: 1567675697,
    selected_tier_id: 3,
    default_tier_id: 4,
    tiers:
    [
      {
        id: 1,
        limit: 5,
        price: 5.99,
        currency: '€'
      }, 
      {
        id: 2,
        limit: 10,
        price: 25.85,
        currency: '€'
      },
      {
        id: 3,
        limit: 15,
        price: 35.85,
        currency: '€'
      },
      {
        id: 4,
        limit: 20,
        price: 44.85,
        currency: '€'
      },
      {
        id: 5,
        limit: 25,
        price: 55.85,
        currency: '€'
      }
    ]
  }
];

export const SUBSCRIPTION_SUCCESS: SubscriptionResponse = {
  id: "c040cfbe-0c2e-1a28-1224-4df193f0082c",
  latest_invoice_id: "in_1FCTUQKhcEtiGcVWUQ5zweMx",
  payment_secret_key: "pi_1FCTUQKhcEtiGcVWGhSD8nTh_secret_cbZYEqX2QjIOSJWNZgTFXvoCC",
  payment_status: "succeeded",
  status: "active",
  subscription_plan_id: "plan_FSWGMZq6tDdiKc"
}

export const SUBSCRIPTION_REQUIRES_ACTION: SubscriptionResponse = {
  id: "c040cfbe-0c2e-1a28-1224-4df193f0082c",
  latest_invoice_id: "in_1FCTUQKhcEtiGcVWUQ5zweMx",
  payment_secret_key: "pi_1FCTUQKhcEtiGcVWGhSD8nTh_secret_cbZYEqX2QjIOSJWNZgTFXvoCC",
  payment_status: "requires_action",
  status: "active",
  subscription_plan_id: "plan_FSWGMZq6tDdiKc"
}

export const SUBSCRIPTION_REQUIRES_PAYMENT: SubscriptionResponse = {
  id: "c040cfbe-0c2e-1a28-1224-4df193f0082c",
  latest_invoice_id: "in_1FCTUQKhcEtiGcVWUQ5zweMx",
  payment_secret_key: "pi_1FCTUQKhcEtiGcVWGhSD8nTh_secret_cbZYEqX2QjIOSJWNZgTFXvoCC",
  payment_status: "requires_payment_method",
  status: "active",
  subscription_plan_id: "plan_FSWGMZq6tDdiKc"
}