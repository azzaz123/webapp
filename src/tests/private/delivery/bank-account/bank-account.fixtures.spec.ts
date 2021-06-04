import { BankAccountApi, BankAccountApiWithCountry } from '@private/features/delivery/interfaces/bank-account/bank-account-api.interface';

export const MOCK_EMPTY_BANK_ACCOUNT = {
  id: 'FAKE_UUID',
  iban: '',
  first_name: '',
  last_name: '',
  address: '',
  flat_and_floor: '',
  postal_code: '',
  city: '',
};

export const MOCK_API_BANK_ACCOUNT_WITH_COUNTRY: BankAccountApiWithCountry = {
  id: 'FAKE_UUID',
  iban: 'ES213872392738273',
  owner_name: 'Laia',
  owner_last_name: 'Lopez',
  street: 'C/ Meridiana',
  flat_and_floor: '6t',
  postal_code: '08027',
  city: 'Barcelona',
  country: 'Spain',
};

export const MOCK_API_BANK_ACCOUNT: BankAccountApi = {
  id: 'FAKE_UUID',
  iban: 'ES213872392738273',
  owner_name: 'Laia',
  owner_last_name: 'Lopez',
  street: 'C/ Meridiana',
  flat_and_floor: '6t',
  postal_code: '08027',
  city: 'Barcelona',
};
