import { SubscriptionResponse, SubscriptionsResponse, Tier } from '../app/core/subscriptions/subscriptions.interface';

export const SUBSCRIPTIONS: SubscriptionsResponse[] = 
[
  {
    category_id: 100, 
    current_limit: 2,
    subscribed_from: null,
    selected_tier_id: null,
    default_tier_id: 'plan_FWuGNucr7WgWUc',
    tiers:
    [
      {
        id: 'plan_FWuFVeTHEDyECa',
        limit: 9,
        price: 9.99,
        currency: '€'
      }, 
      {
        id: 'plan_FWuGNucr7WgWUc',
        limit: 30,
        price: 19.99,
        currency: '€'
      },
      {
        id: 'plan_FWuGwiERYLvlC6',
        limit: 50,
        price: 39.99,
        currency: '€'
      },
      {
        id: 'plan_FWuHrLv9WislLd',
        limit: -1,
        price: 69.99,
        currency: '€'
      }
    ]
  },
  {
    category_id: 200, 
    current_limit: 1,
    subscribed_from: null,
    selected_tier_id: null,
    default_tier_id: 'plan_FSWD733ykyJjwC',
    tiers:
    [
      {
        id: 'plan_FSWD733ykyJjwC',
        limit: 9,
        price: 9.99,
        currency: '€'
      }, 
      {
        id: 'plan_FSWD7I80aaEBNF',
        limit: 25,
        price: 19.99,
        currency: '€'
      },
      {
        id: 'plan_FSWD7IYALDI6iB',
        limit: 100,
        price: 29.99,
        currency: '€'
      }
    ]
  },
  {
    category_id: 14000, 
    current_limit: 3,
    subscribed_from: 1567675697,
    selected_tier_id: 'plan_FHeLJTn9g16fsq',
		default_tier_id: 'plan_FmLhWAmQMXPaK9',
    tiers:
    [
      {
        id: 'plan_FmLhWAmQMXPaK9',
        limit: 5,
        price: 9.99,
        currency: '€'
      }, 
      {
        id: 'plan_FHeLYC4HcSRbse',
        limit: 15,
        price: 39.00,
        currency: '€'
      },
      {
        id: 'plan_FHeLJTn9g16fsq',
        limit: 50,
        price: 69.00,
        currency: '€'
      }
    ]
  }
];

export const MAPPED_SUBSCRIPTIONS: SubscriptionsResponse[] = 
[
  {
    category_id: 100, 
    current_limit: 2,
    subscribed_from: null,
    selected_tier_id: null,
    default_tier_id: 'plan_FWuGNucr7WgWUc',
    tiers:
    [
      {
        id: 'plan_FWuFVeTHEDyECa',
        limit: 9,
        price: 9.99,
        currency: '€'
      }, 
      {
        id: 'plan_FWuGNucr7WgWUc',
        limit: 30,
        price: 19.99,
        currency: '€'
      },
      {
        id: 'plan_FWuGwiERYLvlC6',
        limit: 50,
        price: 39.99,
        currency: '€'
      },
      {
        id: 'plan_FWuHrLv9WislLd',
        limit: -1,
        price: 69.99,
        currency: '€'
      }
    ],
    category_name: 'Cars',
    category_icon: 'category_Cars',
    selected_tier: null
  },
  {
    category_id: 200, 
    current_limit: 1,
    subscribed_from: null,
    selected_tier_id: null,
    default_tier_id: 'plan_FSWD733ykyJjwC',
    tiers:
    [
      {
        id: 'plan_FSWD733ykyJjwC',
        limit: 9,
        price: 9.99,
        currency: '€'
      }, 
      {
        id: 'plan_FSWD7I80aaEBNF',
        limit: 25,
        price: 19.99,
        currency: '€'
      },
      {
        id: 'plan_FSWD7IYALDI6iB',
        limit: 100,
        price: 29.99,
        currency: '€'
      }
    ],
    category_name: 'Housing',
    category_icon: 'category_RealEstate',
    selected_tier: null
  },
  {
    category_id: 14000, 
    current_limit: 3,
    subscribed_from: 1567675697,
    selected_tier_id: 'plan_FHeLJTn9g16fsq',
		default_tier_id: 'plan_FmLhWAmQMXPaK9',
    tiers:
    [
      {
        id: 'plan_FmLhWAmQMXPaK9',
        limit: 5,
        price: 9.99,
        currency: '€'
      }, 
      {
        id: 'plan_FHeLYC4HcSRbse',
        limit: 15,
        price: 39.00,
        currency: '€'
      },
      {
        id: 'plan_FHeLJTn9g16fsq',
        limit: 50,
        price: 69.00,
        currency: '€'
      }
    ],
    category_name: 'Motorbikes',
    category_icon: 'category_Motorbike',
    selected_tier: {
      id: 'plan_FHeLJTn9g16fsq',
      limit: 50,
      price: 69.00,
      currency: '€'
    }
  }
];

export const TIER: Tier = {
  id: 'plan_FWuFVeTHEDyECa',
  limit: 9,
  price: 9.99,
  currency: '€'
}

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