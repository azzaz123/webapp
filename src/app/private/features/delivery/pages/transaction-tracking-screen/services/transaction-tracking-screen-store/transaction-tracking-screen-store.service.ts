import { Injectable } from '@angular/core';
import { TransactionTracking, TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class TransactionTrackingScreenStoreService {
  private readonly transactionTrackingSubject: ReplaySubject<TransactionTracking> = new ReplaySubject(1);
  private readonly transactionTrackingDetailsSubject: ReplaySubject<TransactionTrackingDetails> = new ReplaySubject(1);

  get transactionTracking$(): Observable<TransactionTracking> {
    return this.transactionTrackingSubject.asObservable();
  }

  set transactionTracking(info: TransactionTracking) {
    this.transactionTrackingSubject.next(info);
  }

  get transactionTrackingDetails$(): Observable<TransactionTrackingDetails> {
    return this.transactionTrackingDetailsSubject.asObservable();
  }

  set transactionTrackingDetails(details: TransactionTrackingDetails) {
    this.transactionTrackingDetailsSubject.next(details);
  }
}
