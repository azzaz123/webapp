export interface BankAccount {
  id: string;
  iban: string;
  first_name: string;
  last_name: string;
  address: string;
  flat_and_floor: string;
  postal_code: string;
  city: string;
}

export interface BankAccountApi {
  id: string;
  iban: string;
  owner_name: string;
  owner_last_name: string;
  street: string;
  flat_and_floor: string;
  postal_code: string;
  city: string;
}

export interface BankAccountApiWithCountry extends BankAccountApi {
  country: string;
}
