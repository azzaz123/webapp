import { Injectable } from '@angular/core';

import { TransactionTrackingActionTypeDto } from '@api/bff/delivery/transaction-tracking/dtos/responses';
import { TransactionTrackingHttpService } from '@api/bff/delivery/transaction-tracking/http/transaction-tracking-http.service';
import { mapTransactionTrackingDetailsDtoTransactionTrackingDetails } from '@api/bff/delivery/transaction-tracking/mappers/responses/details/transaction-tracking-details.mapper';
import { mapTransactionTrackingInstructionsDtoTransactionTrackingInstructions } from '@api/bff/delivery/transaction-tracking/mappers/responses/instructions/transaction-tracking-instructions.mapper';
import { mapTransactionTrackingDtoTransactionTracking } from '@api/bff/delivery/transaction-tracking/mappers/responses/transaction-tracking.mapper';
import {
  TransactionTracking,
  TransactionTrackingDetails,
  TransactionTrackingInstructions,
} from '@api/core/model/delivery/transaction/tracking';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TransactionTrackingService {
  constructor(private transactionTrackingHttpService: TransactionTrackingHttpService) {}

  public get(requestId: string): Observable<TransactionTracking> {
    return this.transactionTrackingHttpService.get(requestId).pipe(map(mapTransactionTrackingDtoTransactionTracking));
  }

  public getDetails(requestId: string): Observable<TransactionTrackingDetails> {
    return this.transactionTrackingHttpService.getDetails(requestId).pipe(map(mapTransactionTrackingDetailsDtoTransactionTrackingDetails));
  }

  public getInstructions(requestId: string, actionType: TransactionTrackingActionTypeDto): Observable<TransactionTrackingInstructions> {
    return this.transactionTrackingHttpService
      .getInstructions(requestId, actionType)
      .pipe(map(mapTransactionTrackingInstructionsDtoTransactionTrackingInstructions));
  }
}
