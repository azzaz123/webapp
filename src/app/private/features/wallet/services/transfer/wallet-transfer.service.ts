import { Injectable } from '@angular/core';

import { Money } from '@api/core/model/money.interface';
import { WalletTransferApiService } from '../api/transfer-api/wallet-transfer-api.service';
import { WalletTransferMapperService } from './mapper/wallet-transfer-mapper.service';

import { Observable } from 'rxjs';

const PayUserBankAccountStarted: string = 'STARTED';

@Injectable()
export class WalletTransferService {
  constructor(
    private walletTransferApiService: WalletTransferApiService,
    private walletTransferMapperService: WalletTransferMapperService
  ) {}

  public checkPayUserBankAccount(): Observable<null> {
    return this.walletTransferApiService.checkPayUserBankAccount(PayUserBankAccountStarted);
  }

  public transfer(money: Money): Observable<null> {
    return this.walletTransferApiService.transfer(this.walletTransferMapperService.mapToRequest(money));
  }
}
