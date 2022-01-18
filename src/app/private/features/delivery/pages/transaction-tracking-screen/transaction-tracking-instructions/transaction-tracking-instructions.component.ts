import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { DELIVERY_PATH_PARAMS } from '@private/features/delivery/delivery-routing-constants';
import { SharedErrorActionService } from '@shared/error-action';
import { TransactionTrackingInstructions } from '@api/core/model/delivery/transaction/tracking';
import {
  TransactionTrackingActionType,
  TransactionTrackingService,
} from '@api/bff/delivery/transaction-tracking/transaction-tracking.service';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'tsl-transaction-tracking-instructions',
  templateUrl: './transaction-tracking-instructions.component.html',
  styleUrls: ['./transaction-tracking-instructions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTrackingInstructionsComponent implements OnInit {
  public transactionTrackingInstructions$: Observable<TransactionTrackingInstructions>;

  constructor(
    private errorActionService: SharedErrorActionService,
    private route: ActivatedRoute,
    private transactionTrackingService: TransactionTrackingService
  ) {}

  ngOnInit(): void {
    const actionType = this.route.snapshot.paramMap.get(DELIVERY_PATH_PARAMS.TYPE);
    const transactionId = this.route.snapshot.paramMap.get(DELIVERY_PATH_PARAMS.ID);
    this.transactionTrackingInstructions$ = this.transactionTrackingService
      .getInstructions(transactionId, actionType as TransactionTrackingActionType)
      .pipe(
        catchError((error: unknown) => {
          this.errorActionService.show(error);
          return throwError(error);
        })
      );
  }
}
