import { Component } from '@angular/core';

import { DeliveryPendingTransactionsAndRequests } from '@api/core/model/delivery';
import { SharedErrorActionService } from '@shared/error-action';

import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { DeliveryPendingTransaction } from '@api/core/model/delivery/transaction/delivery-pending-transaction.interface';
import { DeliveriesOngoingService } from '@api/bff/delivery/deliveries/ongoing/deliveries-ongoing.service';

@Component({
  selector: 'tsl-wallet-pending-transactions',
  templateUrl: './wallet-pending-transactions.component.html',
  styleUrls: ['./wallet-pending-transactions.component.scss'],
})
export class WalletPendingTransactionsComponent {
  public pendingTransactionsAsSeller: Observable<DeliveryPendingTransaction[]>;

  constructor(private deliveriesOngoingService: DeliveriesOngoingService, private errorActionService: SharedErrorActionService) {
    this.pendingTransactionsAsSeller = this.deliveriesOngoingService.pendingTransactionsAndRequestsAsSeller.pipe(
      map((response: DeliveryPendingTransactionsAndRequests) => response.transactions),
      catchError((error: unknown) => {
        this.errorActionService.show(error);
        return throwError(error);
      })
    );
  }
}
