import { of } from 'rxjs';

import {
  SubscriptionResponse,
  SubscriptionsResponse,
  Tier,
  SubscriptionSlotResponse,
  SubscriptionSlot
} from '../app/core/subscriptions/subscriptions.interface';
import { CATEGORY_DATA_WEB } from './category.fixtures.spec';
import { SUBSCRIPTION_TYPES } from '../app/core/subscriptions/subscriptions.service';

export class MockSubscriptionService {
  public getSlots() {
    return of([]);
  }

  public getSlotCategory(_id) {
    return of([]);
  }

  public getUserSubscriptionType() {
    return of(SUBSCRIPTION_TYPES.web);
  }
}

export const MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE: SubscriptionSlotResponse = {
  category_id: 100,
  available: 3,
  limit: 10
};

export const MOCK_SUBSCRIPTION_SLOT_MOTORBIKES_RESPONSE: SubscriptionSlotResponse = {
  category_id: 14000,
  available: 2,
  limit: 10
};

export const MOCK_SUBSCRIPTION_SLOT_MOTOR_ACCESSORIES_RESPONSE: SubscriptionSlotResponse = {
  category_id: 12800,
  available: 0,
  limit: 10
};

export const MOCK_SUBSCRIPTION_SLOTS_RESPONSE: SubscriptionSlotResponse[] = [
  MOCK_SUBSCRIPTION_SLOT_CARS_RESPONSE,
  MOCK_SUBSCRIPTION_SLOT_MOTOR_ACCESSORIES_RESPONSE,
  MOCK_SUBSCRIPTION_SLOT_MOTORBIKES_RESPONSE
];

export const MOCK_SUBSCRIPTION_SLOT_CARS: SubscriptionSlot = {
  category: CATEGORY_DATA_WEB[0],
  available: 0,
  limit: 10
};

export const SUBSCRIPTIONS: SubscriptionsResponse[] = 
[
  {
    category_id: 12800, 
    current_limit: 2,
    subscribed_from: null,
    selected_tier_id: null,
    default_tier_id: 'plan_Fsf0Htv8L6Ox91',
    tiers:
    [
      {
        id: 'plan_Fsf0Htv8L6Ox91',
        limit: 9,
        price: 9.99,
        currency: '€'
      }, 
      {
        id: 'plan_Fsf0cCjrcaSCLx',
        limit: 50,
        price: 39.99,
        currency: '€'
      },
      {
        id: 'plan_Fsf1jU8y7A9gh4',
        limit: 200,
        price: 69.99,
        currency: '€'
      },
      {
        id: 'plan_Fsf2JK1vCkSx6g',
        limit: -1,
        price: 129.99,
        currency: '€'
      }
    ]
  },
  {
    category_id: 100, 
    current_limit: 1,
    subscribed_from: null,
    selected_tier_id: null,
    default_tier_id: 'plan_FsewICdAYXBUY0',
    tiers:
    [
      {
        id: 'plan_FsevTLryG1uX1w',
        limit: 9,
        price: 39.99,
        currency: '€'
      }, 
      {
        id: 'plan_FsewICdAYXBUY0',
        limit: 30,
        price: 69.99,
        currency: '€'
      },
      {
        id: 'plan_FsewaztmR8E0pC',
        limit: 50,
        price: 149.99,
        currency: '€'
      },
      {
        id: 'plan_Fsew7d8gFnVD9V',
        limit: -1,
        price: 199.99,
        currency: '€'
      }
    ]
  },
  {
    category_id: 14000, 
    current_limit: 3,
    subscribed_from: 1567675697,
    selected_tier_id: 'plan_FWuGNucr7WgWUc',
		default_tier_id: 'plan_FWuFVeTHEDyECa',
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
    category_id: 14000, 
    current_limit: 3,
    subscribed_from: 1567675697,
    subscribed_until: 1574516986,
    selected_tier_id: 'plan_FWuGNucr7WgWUc',
		default_tier_id: 'plan_FWuFVeTHEDyECa',
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
  }
];

export const SUBSCRIPTIONS_NOT_SUB: SubscriptionsResponse[] = 
[
  {
    category_id: 12800, 
    current_limit: 2,
    subscribed_from: null,
    selected_tier_id: null,
    default_tier_id: 'plan_Fsf0Htv8L6Ox91',
    tiers:
    [
      {
        id: 'plan_Fsf0Htv8L6Ox91',
        limit: 9,
        price: 9.99,
        currency: '€'
      }, 
      {
        id: 'plan_Fsf0cCjrcaSCLx',
        limit: 50,
        price: 39.99,
        currency: '€'
      },
      {
        id: 'plan_Fsf1jU8y7A9gh4',
        limit: 200,
        price: 69.99,
        currency: '€'
      },
      {
        id: 'plan_Fsf2JK1vCkSx6g',
        limit: -1,
        price: 129.99,
        currency: '€'
      }
    ]
  },
  {
    category_id: 100, 
    current_limit: 1,
    subscribed_from: null,
    selected_tier_id: null,
    default_tier_id: 'plan_FsewICdAYXBUY0',
    tiers:
    [
      {
        id: 'plan_FsevTLryG1uX1w',
        limit: 9,
        price: 39.99,
        currency: '€'
      }, 
      {
        id: 'plan_FsewICdAYXBUY0',
        limit: 30,
        price: 69.99,
        currency: '€'
      },
      {
        id: 'plan_FsewaztmR8E0pC',
        limit: 50,
        price: 149.99,
        currency: '€'
      },
      {
        id: 'plan_Fsew7d8gFnVD9V',
        limit: -1,
        price: 199.99,
        currency: '€'
      }
    ]
  },
  {
    category_id: 14000, 
    current_limit: 3,
    subscribed_from: null,
    selected_tier_id: null,
		default_tier_id: 'plan_FWuFVeTHEDyECa',
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
    category_id: 14000, 
    current_limit: 3,
    subscribed_from: null,
    subscribed_until: null,
    selected_tier_id: null,
		default_tier_id: 'plan_FWuFVeTHEDyECa',
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
  }
];

export const MAPPED_SUBSCRIPTIONS: SubscriptionsResponse[] = 
[
  {
    category_id: 12800, 
    current_limit: 2,
    subscribed_from: null,
    selected_tier_id: null,
    default_tier_id: 'plan_Fsf0Htv8L6Ox91',
    tiers:
    [
      {
        id: 'plan_Fsf0Htv8L6Ox91',
        limit: 9,
        price: 9.99,
        currency: '€'
      }, 
      {
        id: 'plan_Fsf0cCjrcaSCLx',
        limit: 50,
        price: 39.99,
        currency: '€'
      },
      {
        id: 'plan_Fsf1jU8y7A9gh4',
        limit: 200,
        price: 69.99,
        currency: '€'
      },
      {
        id: 'plan_Fsf2JK1vCkSx6g',
        limit: -1,
        price: 129.99,
        currency: '€'
      }
    ],
    category_name: 'Motor & Accessories',
    category_icon: 'category_MotorAccessories',
    selected_tier: null
  },
  {
    category_id: 100, 
    current_limit: 1,
    subscribed_from: null,
    selected_tier_id: null,
    default_tier_id: 'plan_FsewICdAYXBUY0',
    tiers:
    [
      {
        id: 'plan_FsevTLryG1uX1w',
        limit: 9,
        price: 39.99,
        currency: '€'
      }, 
      {
        id: 'plan_FsewICdAYXBUY0',
        limit: 30,
        price: 69.99,
        currency: '€'
      },
      {
        id: 'plan_FsewaztmR8E0pC',
        limit: 50,
        price: 149.99,
        currency: '€'
      },
      {
        id: 'plan_Fsew7d8gFnVD9V',
        limit: -1,
        price: 199.99,
        currency: '€'
      }
    ],
    category_name: 'Cars',
    category_icon: 'category_Cars',
    selected_tier: null
  },
  {
    category_id: 14000, 
    current_limit: 3,
    subscribed_from: 1567675697,
    selected_tier_id: 'plan_FWuGNucr7WgWUc',
		default_tier_id: 'plan_FWuFVeTHEDyECa',
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
    category_name: 'Motorbikes',
    category_icon: 'category_Motorbike',
    selected_tier: {
      id: 'plan_FWuGNucr7WgWUc',
      limit: 30,
      price: 19.99,
      currency: '€'
    }
  }
];

export const MAPPED_SUBSCRIPTIONS_ADDED: SubscriptionsResponse[] = 
[
  {
    category_id: 12800, 
    current_limit: 2,
    subscribed_from: 1567675697,
    selected_tier_id: 'plan_Fsf0cCjrcaSCLx',
    default_tier_id: 'plan_Fsf0Htv8L6Ox91',
    tiers:
    [
      {
        id: 'plan_Fsf0Htv8L6Ox91',
        limit: 9,
        price: 9.99,
        currency: '€'
      }, 
      {
        id: 'plan_Fsf0cCjrcaSCLx',
        limit: 50,
        price: 39.99,
        currency: '€'
      },
      {
        id: 'plan_Fsf1jU8y7A9gh4',
        limit: 200,
        price: 69.99,
        currency: '€'
      },
      {
        id: 'plan_Fsf2JK1vCkSx6g',
        limit: -1,
        price: 129.99,
        currency: '€'
      }
    ],
    category_name: 'Motor & Accessories',
    category_icon: 'category_MotorAccessories',
    selected_tier: null
  },
  {
    category_id: 100, 
    current_limit: 1,
    subscribed_from: null,
    selected_tier_id: null,
    default_tier_id: 'plan_FsewICdAYXBUY0',
    tiers:
    [
      {
        id: 'plan_FsevTLryG1uX1w',
        limit: 9,
        price: 39.99,
        currency: '€'
      }, 
      {
        id: 'plan_FsewICdAYXBUY0',
        limit: 30,
        price: 69.99,
        currency: '€'
      },
      {
        id: 'plan_FsewaztmR8E0pC',
        limit: 50,
        price: 149.99,
        currency: '€'
      },
      {
        id: 'plan_Fsew7d8gFnVD9V',
        limit: -1,
        price: 199.99,
        currency: '€'
      }
    ],
    category_name: 'Cars',
    category_icon: 'category_Cars',
    selected_tier: null
  },
  {
    category_id: 14000, 
    current_limit: 3,
    subscribed_from: 1567675697,
    selected_tier_id: 'plan_FWuGNucr7WgWUc',
		default_tier_id: 'plan_FWuFVeTHEDyECa',
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
    category_name: 'Motorbikes',
    category_icon: 'category_Motorbike',
    selected_tier: {
      id: 'plan_FWuGNucr7WgWUc',
      limit: 30,
      price: 19.99,
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