import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BankAccount, BankAccountApiWithCountry } from '../../interfaces/bank-account/bank-account-api.interface';
import { BankAccountApiService } from '../api/bank-account-api/bank-account-api.service';
import { MapBankAccountService } from './map-bank-account/map-bank-account.service';

@Injectable()
export class BankAccountService {
  private readonly bankAccountSubject: ReplaySubject<BankAccount> = new ReplaySubject<BankAccount>(1);

  constructor(private bankAccountApiService: BankAccountApiService, private mapBankAccountService: MapBankAccountService) {}

  public get bankAccount$(): Observable<BankAccount> {
    return this.bankAccountSubject.asObservable();
  }

  private set currentBankAccount(bankAccount: BankAccount) {
    this.bankAccountSubject.next(bankAccount);
  }

  public get(): Observable<BankAccount> {
    return this.bankAccountApiService.get().pipe(
      map((bankAccountApi: BankAccountApiWithCountry) => this.mapBankAccountService.mapBankAccountApiToForm(bankAccountApi)),
      tap((bankAccount: BankAccount) => (this.currentBankAccount = bankAccount))
    );
  }

  public create(mainBankAccount: BankAccount): Observable<null> {
    return this.bankAccountApiService
      .create(this.mapBankAccountService.mapBankAccountFormToApi(mainBankAccount))
      .pipe(tap(() => this.get()));
  }

  public update(mainBankAccount: BankAccount): Observable<null> {
    return this.bankAccountApiService
      .update(this.mapBankAccountService.mapBankAccountFormToApi(mainBankAccount))
      .pipe(tap(() => this.get()));
  }

  public delete(): Observable<null> {
    return this.bankAccountApiService.delete().pipe(tap(() => (this.currentBankAccount = null)));
  }
}
