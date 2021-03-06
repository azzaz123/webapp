import { CREDIT_CARD_STATUS } from '@api/core/model/cards/credit-card-status.enum';
import { CreditCardSyncRequest } from '@api/core/model/cards/credit-card-sync-request.interface';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { PaymentsSyncCreditCardApi } from '@api/payments/cards/dtos/requests';
import { PaymentsCreditCardApi, TokenizerInformationApi } from '@api/payments/cards/dtos/responses';
import { of } from 'rxjs';

export const MockPaymentsCreditCardService = {
  get() {
    return of(null);
  },
  create() {
    return of(null);
  },
  update() {
    return of(null);
  },
};

export const mockPaymentsCreditCard: PaymentsCreditCardApi = {
  card_holder_name: 'Lolaso Fino Bruh - 17:38',
  country: 'FRA',
  expiration_date: '2025-12-01T00:00:00+0000',
  id: '72c21846-a8e2-4fcf-9eec-118ece123828',
  number_alias: '497010XXXXXX6588',
  status: 'VALID',
};

export const mockInvalidPaymentsCreditCard: PaymentsCreditCardApi = {
  card_holder_name: 'Alejandro Magnou',
  country: 'FRA',
  expiration_date: '2025-12-01T00:00:00+0000',
  id: '72c21846-a8e2-4fcf-9eec-118ece123828',
  number_alias: '497010XXXXXX6588',
  status: 'INVALID',
};

export const mockCreditCard: CreditCard = {
  brand: 'visa',
  expirationDate: new Date('Mon Dec 01 2025 01:00:00 GMT+0100'),
  id: '72c21846-a8e2-4fcf-9eec-118ece123828',
  lastFourDigits: '6588',
  ownerFullName: 'Lolaso Fino Bruh - 17:38',
  provider: 'mangopay',
  status: CREDIT_CARD_STATUS.VALID,
};

export const mockFormCreditCardSyncRequest: CreditCardSyncRequest = {
  id: 'FAKE_UUID',
  fullName: 'Ot el Bruixot',
  cardNumber: '4972 4858 3040 0049',
  cardExpirationDate: '1221',
  cardCvx: '242',
};

export const mockCreditCardSyncRequest: CreditCardSyncRequest = {
  id: 'FAKE_UUID',
  fullName: 'Ot el Bruixot',
  cardNumber: '4972485830400049',
  cardExpirationDate: '1221',
  cardCvx: '242',
};

export const mockCreditCardSyncRequestEmpty: CreditCardSyncRequest = {
  id: 'FAKE_UUID',
  fullName: '',
  cardNumber: '',
  cardExpirationDate: '',
  cardCvx: '',
};

export const mockTokenizerInformationResponse: TokenizerInformationApi = {
  access_key: '1X0m87dmM2LiwFgxPLBJ',
  card_registration_url: 'https://homologation-webpayment.payline.com/webpayment/getToken',
  id: '111497720',
  pre_registration_data: 'YkgVxL1yNY4ZOfKtqEew_XMUy9O3AZGFEHTgKBwYW1ym50soCMtmIkbPx_6tICui2ddFLVXdicolcUIkv_kKEA',
};

export const mockCardRegistrationUrlFormData: string =
  'data=YkgVxL1yNY4ZOfKtqEew_XMUy9O3AZGFEHTgKBwYW1ym50soCMtmIkbPx_6tICui2ddFLVXdicolcUIkv_kKEA&accessKeyRef=1X0m87dmM2LiwFgxPLBJ&cardNumber=4972485830400049&cardExpirationDate=1221&cardCvx=242';

export const mockCardTokenizedResponse: string =
  'data=QOHfBI142JBIpqQJOQyJcwsjr25wTBu8_9tvZWbUlh2Fm53uPWzGoAyuLy8vAqIPRIQMyPqKXxk9X59DUVsGhdx9Kicx6FsPjwxmBfoe3MlvvmS4bJZX_ejoGzljiTdf0ftIYwFxOdfmDQ5GtM_cIg';

export const mockPaymentsCreateSyncCreditCardRequest: PaymentsSyncCreditCardApi = {
  holder_name: mockCreditCardSyncRequest.fullName,
  id: '12345',
  registration_id: mockTokenizerInformationResponse.id,
  token: mockCardTokenizedResponse,
};

export const mockPaymentsUpdateSyncCreditCardRequest: PaymentsSyncCreditCardApi = {
  holder_name: mockCreditCardSyncRequest.fullName,
  id: mockCreditCardSyncRequest.id,
  registration_id: mockTokenizerInformationResponse.id,
  token: mockCardTokenizedResponse,
};

export const MOCK_CREDIT_CARD: CreditCard = {
  id: 'eb07a330-f1e6-4816-8e85-9246323fd614',
  brand: 'visa',
  lastFourDigits: '6596',
  ownerFullName: 'test',
  expirationDate: new Date('2025-08-01T00:00:00.000Z'),
  provider: 'mangopay',
  status: CREDIT_CARD_STATUS.VALID,
};
