import { Injectable } from '@angular/core';
import { TransactionTrackingService } from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';
import { TransactionTracking, TransactionTrackingDetails } from '@api/core/model/delivery/transaction/tracking';
import { forkJoin, Observable, Subject } from 'rxjs';

@Injectable()
export class TransactionTrackingScreenStoreService {
  private readonly transactionTrackingSubject: Subject<TransactionTracking> = new Subject();
  private readonly transactionTrackingDetailsSubject: Subject<TransactionTrackingDetails> = new Subject();

  constructor(private transactionTrackingService: TransactionTrackingService) {}

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

  public refresh(requestId: string): void {
    forkJoin([this.transactionTrackingService.get(requestId), this.transactionTrackingService.getDetails(requestId)]).subscribe(
      ([transactionTracking, transactionTrackingDetails]: [TransactionTracking, TransactionTrackingDetails]) => {
        this.transactionTracking = transactionTracking;
        this.transactionTrackingDetails = transactionTrackingDetails;
      }
    );
  }
}
