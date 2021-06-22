import { CreditCardSyncRequest } from '@api/core/model/cards/credit-card-sync-request.interface';

export const MOCK_EMPTY_CREDIT_CARD_FORM: CreditCardSyncRequest = {
  id: 'FAKE_UUID',
  fullName: '',
  cardNumber: '',
  cardExpirationDate: '',
  cardCvx: '',
};
