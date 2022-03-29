import { Injectable } from '@angular/core';
import { TransactionTracking, TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class TransactionTrackingScreenStoreService {
  private readonly transactionTrackingSubject: Subject<TransactionTracking> = new Subject();
  private readonly transactionTrackingDetailsSubject: Subject<TransactionTrackingDetails> = new Subject();

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
