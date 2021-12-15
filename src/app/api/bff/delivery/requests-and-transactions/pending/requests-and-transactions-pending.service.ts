import { Injectable } from '@angular/core';
import { PendingTransaction } from '@api/core/model';
import { UserService } from '@core/user/user.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RequestsAndTransactionsPendingHttpService } from './http/requests-and-transactions-pending-http.service';
import { mapRequestsAndTransactionsPendingToPendingTransactions } from './mappers/responses/requests-and-transactions-pending.mapper';

@Injectable()
export class RequestsAndTransactionsPendingService {
  private readonly currentUserId = this.userService.user.id;

  constructor(
    private requestsAndTransactionsPendingHttpService: RequestsAndTransactionsPendingHttpService,
    private userService: UserService
  ) {}

  public get pendingTransactions(): Observable<PendingTransaction[]> {
    return this.requestsAndTransactionsPendingHttpService.get().pipe(
      take(1),
      map((dtoResponse) => {
        return mapRequestsAndTransactionsPendingToPendingTransactions({ dtoResponse, currentUserId: this.currentUserId });
      })
    );
  }

  public get pendingTransactionsAsSeller(): Observable<PendingTransaction[]> {
    return this.requestsAndTransactionsPendingHttpService.getAsSeller().pipe(
      take(1),
      map((dtoResponse) => {
        return mapRequestsAndTransactionsPendingToPendingTransactions({ dtoResponse, currentUserId: this.currentUserId });
      })
    );
  }
}
