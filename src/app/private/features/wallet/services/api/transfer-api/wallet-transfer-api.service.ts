import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environments/environment';
import {
  WalletTransferErrorMapper,
  WalletTransferErrorResponse,
} from '@private/features/wallet/errors/mappers/transfer/wallet-transfer-error-mapper';
import { WalletTransferRequestInterface } from '@private/features/wallet/interfaces/transfer/wallet-transfer-request.interface';

import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const PayBankAccountFromUserWalletEndPoint = `${environment.baseUrl}/api/v3/payments/pay_user_bank_account_from_user_wallet`;

@Injectable()
export class WalletTransferApiService {
  private errorMapper: WalletTransferErrorMapper = new WalletTransferErrorMapper();

  constructor(private http: HttpClient) {}

  public transfer(request: WalletTransferRequestInterface): Observable<null> {
    return this.http
      .post<null>(PayBankAccountFromUserWalletEndPoint, request)
      .pipe(catchError((error: WalletTransferErrorResponse) => this.errorMapper.map(error)));
  }
}
