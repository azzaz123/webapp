import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { RequestsAndTransactionsPendingAsSellerHttpService } from './http/requests-and-transactions-pending-as-seller-http.service';

@Injectable()
export class RequestsAndTransactionsPendingAsSellerService {
  constructor(private requestsAndTransactionsPendingAsSellerHttpService: RequestsAndTransactionsPendingAsSellerHttpService) {}

  public get(): Observable<any> {
    return this.requestsAndTransactionsPendingAsSellerHttpService.get().pipe(take(1));
  }
}
