import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BankAccountApi, BankAccountApiWithCountry } from '@private/features/wallet/interfaces/bank-account/bank-account-api.interface';
import {
  BankAccountErrorMapper,
  BankAccountErrorResponse,
} from '@private/features/wallet/errors/mappers/bank-account/bank-account-error-mapper';
import { catchError } from 'rxjs/operators';

export const MAIN_BANK_ACCOUNT_URL = `${environment.baseUrl}api/v3/payments/bank_accounts/main`;

@Injectable()
export class BankAccountApiService {
  private errorMapper: BankAccountErrorMapper = new BankAccountErrorMapper();

  constructor(private http: HttpClient) {}

  public get(): Observable<BankAccountApiWithCountry> {
    return this.http.get<BankAccountApiWithCountry>(MAIN_BANK_ACCOUNT_URL);
  }

  public create(bankAccount: BankAccountApi): Observable<null> {
    return this.http
      .post<null>(MAIN_BANK_ACCOUNT_URL, bankAccount)
      .pipe(catchError((error: BankAccountErrorResponse) => this.errorMapper.map(error)));
  }

  public update(bankAccount: BankAccountApi): Observable<null> {
    return this.http
      .put<null>(MAIN_BANK_ACCOUNT_URL, bankAccount)
      .pipe(catchError((error: BankAccountErrorResponse) => this.errorMapper.map(error)));
  }

  public delete(): Observable<null> {
    return this.http.delete<null>(MAIN_BANK_ACCOUNT_URL);
  }
}
