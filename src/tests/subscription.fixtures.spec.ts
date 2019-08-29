import { FinancialCard } from '../app/shared/profile/credit-card-info/financial-card';
import { FinancialCardOption, StripeCard, BillingDetails, PaymentMethodResponse, Address } from '../app/core/payments/payment.interface';
import { STRIPE_CARD } from './stripe.fixtures.spec';
import { Subscription } from '../app/core/subscriptions/subscriptions.interface';

export const ADDRESS: Address = {
  city: 'Olesa de M.',
  country: 'ES',
  line1: 'Carrer Major, 2',
  line2: 'Apartamento 3B',
  postal_code: 08640,
  state: 'Barcelona',
};

export const BILLING_DETAILS: BillingDetails = {
  address: ADDRESS,
  email: 'test@wallapop.com',
  name: 'Test User',
  phone: 666666666
};

export const PAYMENT_METHOD: PaymentMethodResponse = {
  billing_details: BILLING_DETAILS,
  card: STRIPE_CARD,
  created: 1566916623,
  customer: null,
  id: "pm_1FC5n8KhcEtiGcVWsAmwPgH2",
  livemode: false,
  metadata: {},
  object: "payment_method",
  type: "card"
};

export const SUBSCRIPTION_SUCCESS: Subscription = {
  id: "c040cfbe-0c2e-1a28-1224-4df193f0082c",
  latest_invoice_id: "in_1FCTUQKhcEtiGcVWUQ5zweMx",
  payment_secret_key: "pi_1FCTUQKhcEtiGcVWGhSD8nTh_secret_cbZYEqX2QjIOSJWNZgTFXvoCC",
  payment_status: "succeeded",
  status: "active",
  subscription_plan_id: "plan_FSWGMZq6tDdiKc"
}

export const SUBSCRIPTION_REQUIRES_ACTION: Subscription = {
  id: "c040cfbe-0c2e-1a28-1224-4df193f0082c",
  latest_invoice_id: "in_1FCTUQKhcEtiGcVWUQ5zweMx",
  payment_secret_key: "pi_1FCTUQKhcEtiGcVWGhSD8nTh_secret_cbZYEqX2QjIOSJWNZgTFXvoCC",
  payment_status: "requires_action",
  status: "active",
  subscription_plan_id: "plan_FSWGMZq6tDdiKc"
}

export const SUBSCRIPTION_REQUIRES_PAYMENT: Subscription = {
  id: "c040cfbe-0c2e-1a28-1224-4df193f0082c",
  latest_invoice_id: "in_1FCTUQKhcEtiGcVWUQ5zweMx",
  payment_secret_key: "pi_1FCTUQKhcEtiGcVWGhSD8nTh_secret_cbZYEqX2QjIOSJWNZgTFXvoCC",
  payment_status: "requires_payment_method",
  status: "active",
  subscription_plan_id: "plan_FSWGMZq6tDdiKc"
}