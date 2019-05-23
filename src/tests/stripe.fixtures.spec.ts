import { FinancialCard } from '../app/shared/profile/credit-card-info/financial-card';
import { FinancialCardOption, StripeCard } from '../app/core/payments/payment.interface';

export const STRIPE_CARD: StripeCard = {
  brand: null,
  checks: null,
  country: null,
  exp_month: 2,
  exp_year: 2020,
  funding: null,
  generated_from: null,
  last4: '4242',
  three_d_secure_usage: { supported : null },
  wallet: null
};

export const FINANCIAL_CARD_OPTION: FinancialCardOption[] = [
  {
    value: '4242',
    label: '4242',
    expire_date: '01/2021',
    id: 'pm_2f2f2f',
    number: '4242',
    favorite: true,
    stripeCard: STRIPE_CARD
  },
  {
    value: '2121',
    label: '2121',
    expire_date: '01/2021',
    id: 'pm_6u6u6u',
    number: '2121',
    favorite: false,
    stripeCard: null
  }
];

export function createFinancialCardFixture(): FinancialCard {

  return new FinancialCard(
    '2/2020',
    'pm_a0b1c2',
    '4242',
    null,
    STRIPE_CARD
  );
}