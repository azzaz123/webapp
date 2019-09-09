import { SubscriptionResponse, SubscriptionsResponse } from '../app/core/subscriptions/subscriptions.interface';

export const SUBSCRIPTIONS: SubscriptionsResponse[] = 
[
  {
    category_id: 100, 
    current_limit: 2,
    subscribed_from: null,
    selected_tier_id: null,
    default_tier_id: 'plan_x2r23x23xf2',
    tiers:
    [
      {
        id: 'plan_34r34g3fsdsd',
        limit: 5,
        price: 9.99,
        currency: '€'
      }, 
      {
        id: 'plan_x2r23x23xf2',
        limit: 10,
        price: 25.85,
        currency: '€'
      },
      {
        id: 'plan_k7k7k78k8k',
        limit: 15,
        price: 35.85,
        currency: '€'
      },
      {
        id: 'plan_x34f4f33ff2',
        limit: 20,
        price: 44.85,
        currency: '€'
      },
      {
        id: 'plan_fkmvkomsio3',
        limit: 25,
        price: 55.85,
        currency: '€'
      },
      {
        id: 'plan_9009dai0sdf',
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
    default_tier_id: 'plan_9fdidsfisd',
    tiers:
    [
      {
        id: 'plan_xaxasxasc2',
        limit: 5,
        price: 29.99,
        currency: '€'
      }, 
      {
        id: 'plan_c89vi0jbbu92',
        limit: 10,
        price: 25.85,
        currency: '€'
      },
      {
        id: 'plan_89d0a0ad09ads',
        limit: 15,
        price: 35.85,
        currency: '€'
      },
      {
        id: 'plan_09dji0238u',
        limit: 20,
        price: 44.85,
        currency: '€'
      },
      {
        id: 'plan_9fdidsfisd',
        limit: 25,
        price: 55.85,
        currency: '€'
      },
      {
        id: 'plan_90qdkmp12hu9d',
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
      'selected_tier_id': 'plan_FSWD7IYALDI6iB',
			'default_tier_id': 'plan_FWuHrLv9WislLd',
    tiers:
    [
      {
        id: 'plan_FWuHrLv9WislLd',
        limit: 5,
        price: 20.85,
        currency: '€'
      }, 
      {
        id: 'plan_FSWD7IYALDI6iB',
        limit: 10,
        price: 25.85,
        currency: '€'
      },
      {
        id: 'plan_FWuGwiERYLvlC6',
        limit: 15,
        price: 35.85,
        currency: '€'
      },
      {
        id: 'plan_FSWD7I80aaEBNF',
        limit: 20,
        price: 44.85,
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