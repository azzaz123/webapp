import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';
import {
  WalletTransferErrorMapper,
  WalletTransferErrorResponse,
} from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-error-mapper';
import { WalletTransferPayUserBankAccountErrorMapper } from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-pay-user-bank-account-error-mapper';
import { WalletTransferRequest } from '@private/features/wallet/interfaces/transfer/wallet-transfer-request.interface';

import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const PayBankAccountFromUserWalletEndPoint = `${environment.baseUrl}/api/v3/payments/pay_user_bank_account_from_user_wallet`;
export const PayUserBankAccountsEndPoint = `${environment.baseUrl}/api/v3/payments/pay_user_bank_accounts`;

const StatusParam: string = 'status';

@Injectable()
export class WalletTransferApiService {
  private errorMapper: WalletTransferErrorMapper = new WalletTransferErrorMapper();
  private payUserBankAccountErrorMapper: WalletTransferErrorMapper = new WalletTransferPayUserBankAccountErrorMapper();

  constructor(private http: HttpClient) {}

  public checkPayUserBankAccount(status: string): Observable<null> {
    const params: HttpParams = new HttpParams().append(StatusParam, status);

    return this.http
      .head<null>(PayUserBankAccountsEndPoint, { params: params })
      .pipe(catchError((error: WalletTransferErrorResponse) => this.payUserBankAccountErrorMapper.map(error)));
  }

  public transfer(request: WalletTransferRequest): Observable<null> {
    return this.http
      .post<null>(PayBankAccountFromUserWalletEndPoint, request)
      .pipe(catchError((error: WalletTransferErrorResponse) => this.errorMapper.map(error)));
  }
}
