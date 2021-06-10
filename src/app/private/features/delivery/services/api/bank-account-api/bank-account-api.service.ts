import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BankAccountApi, BankAccountApiWithCountry } from '@private/features/delivery/interfaces/bank-account/bank-account-api.interface';

export const MAIN_BANK_ACCOUNT_URL = `${environment.baseUrl}/api/v3/payments/bank_accounts/main`;

@Injectable()
export class BankAccountApiService {
  constructor(private http: HttpClient) {}

  public get(): Observable<BankAccountApiWithCountry> {
    return this.http.get<BankAccountApiWithCountry>(MAIN_BANK_ACCOUNT_URL);
  }

  public create(bankAccount: BankAccountApi): Observable<null> {
    return this.http.post<null>(MAIN_BANK_ACCOUNT_URL, bankAccount);
  }

  public update(bankAccount: BankAccountApi): Observable<null> {
    return this.http.put<null>(MAIN_BANK_ACCOUNT_URL, bankAccount);
  }

  public delete(): Observable<null> {
    return this.http.delete<null>(MAIN_BANK_ACCOUNT_URL);
  }
}
