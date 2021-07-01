import { Injectable } from '@angular/core';
import {
  BankAccount,
  BankAccountApi,
  BankAccountApiWithCountry,
} from '@private/features/wallet/interfaces/bank-account/bank-account-api.interface';

@Injectable()
export class MapBankAccountService {
  public mapBankAccountApiToForm(bankAccountApi: BankAccountApiWithCountry): BankAccount {
    return {
      id: bankAccountApi.id,
      iban: bankAccountApi.iban,
      first_name: bankAccountApi.owner_name,
      last_name: bankAccountApi.owner_last_name,
      address: bankAccountApi.street,
      flat_and_floor: bankAccountApi.flat_and_floor,
      postal_code: bankAccountApi.postal_code,
      city: bankAccountApi.city,
    };
  }

  public mapBankAccountFormToApi(bankAccount: BankAccount): BankAccountApi {
    return {
      id: bankAccount.id,
      iban: bankAccount.iban,
      owner_name: bankAccount.first_name,
      owner_last_name: bankAccount.last_name,
      street: bankAccount.address,
      flat_and_floor: bankAccount.flat_and_floor,
      postal_code: bankAccount.postal_code,
      city: bankAccount.city,
    };
  }
}
