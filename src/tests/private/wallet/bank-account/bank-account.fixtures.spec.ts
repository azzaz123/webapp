import {
  BankAccount,
  BankAccountApi,
  BankAccountApiWithCountry,
} from '@private/features/wallet/interfaces/bank-account/bank-account-api.interface';

export const MOCK_EMPTY_BANK_ACCOUNT: BankAccount = {
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

export const MOCK_BANK_ACCOUNT: BankAccount = {
  id: 'FAKE_UUID',
  iban: 'ES213872392738273',
  first_name: 'Laia',
  last_name: 'Lopez',
  address: 'C/ Meridiana',
  flat_and_floor: '6t',
  postal_code: '08027',
  city: 'Barcelona',
};

export const MOCK_BANK_ACCOUNT_FORMATTED_IBAN: BankAccount = { ...MOCK_BANK_ACCOUNT, iban: 'ES21 3872 3927 3827 3' };

export const MOCK_BANK_ACCOUNT_INVALID: BankAccount = {
  id: 'FAKE_UUID',
  iban: 'ES213872392738273',
  first_name: 'Laia',
  last_name: 'Lopez',
  address: 'C/ Meridiana',
  flat_and_floor: '6t',
  postal_code: null,
  city: 'Barcelona',
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
