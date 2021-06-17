import { CreditCardSyncRequest } from '@api/core/model/cards/credit-card-sync-request.interface';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { PaymentsCreditCardApi } from '@api/payments/cards/dtos/responses';

export const mockPaymentsCreditCard: PaymentsCreditCardApi = {
  card_holder_name: 'Lolaso Fino Bruh - 17:38',
  country: 'FRA',
  expiration_date: '2025-12-01T00:00:00+0000',
  id: '72c21846-a8e2-4fcf-9eec-118ece123828',
  number_alias: '497010XXXXXX6588',
  status: 'VALID',
};

export const mockCreditCard: CreditCard = {
  brand: 'visa',
  expirationDate: new Date('Mon Dec 01 2025 01:00:00 GMT+0100'),
  id: '72c21846-a8e2-4fcf-9eec-118ece123828',
  lastFourDigits: '6588',
  ownerFullName: 'Lolaso Fino Bruh - 17:38',
  provider: 'mangopay',
};

export const mockCreditCardSyncRequest: CreditCardSyncRequest = {
  id: 'ui-ui-uiiii-id',
  fullname: 'Ot el Bruixot',
  cardNumber: '4972485830400049',
  cardExpirationDate: '1221',
  cardCvx: '242',
};
