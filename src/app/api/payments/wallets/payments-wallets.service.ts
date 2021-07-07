import { Injectable } from '@angular/core';
import { Money } from '@api/core/model/money.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaymentsWalletsHttpService } from './http/payments-wallets-http.service';
import { mapPaymentsWalletsApiToMoney } from './mappers/responses/payments-wallets.mapper';

@Injectable()
export class PaymentsWalletsService {
  constructor(private paymentsWalletsHttpService: PaymentsWalletsHttpService) {}

  public get(): Observable<Money> {
    return this.paymentsWalletsHttpService.get().pipe(map(mapPaymentsWalletsApiToMoney));
  }
}
