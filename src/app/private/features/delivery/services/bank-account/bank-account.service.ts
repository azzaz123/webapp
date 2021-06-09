import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BankAccount, BankAccountApiWithCountry } from '../../interfaces/bank-account/bank-account-api.interface';
import { BankAccountApiService } from '../api/bank-account-api/bank-account-api.service';
import { MapBankAccountService } from './map-bank-account/map-bank-account.service';

@Injectable()
export class BankAccountService {
  constructor(private bankAccountApiService: BankAccountApiService, private mapBankAccountService: MapBankAccountService) {}

  public get(): Observable<BankAccount> {
    return this.bankAccountApiService
      .get()
      .pipe(map((bankAccountApi: BankAccountApiWithCountry) => this.mapBankAccountService.mapBankAccountApiToForm(bankAccountApi)));
  }

  public create(mainBankAccount: BankAccount): Observable<null> {
    return this.bankAccountApiService.create(this.mapBankAccountService.mapBankAccountFormToApi(mainBankAccount));
  }

  public update(mainBankAccount: BankAccount): Observable<null> {
    return this.bankAccountApiService.update(this.mapBankAccountService.mapBankAccountFormToApi(mainBankAccount));
  }

  public delete(): Observable<null> {
    return this.bankAccountApiService.delete();
  }
}
