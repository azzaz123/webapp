import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  TRANSACTION_TRACKING_DETAILS_ENDPOINT,
  TRANSACTION_TRACKING_ENDPOINT,
  TRANSACTION_TRACKING_INSTRUCTIONS_ENDPOINT,
} from '@api/bff/delivery/transaction-tracking/http/endpoints';
import {
  TransactionTrackingActionTypeDto,
  TransactionTrackingDetailsDto,
  TransactionTrackingDto,
  TransactionTrackingInstructionsDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';

import { Observable } from 'rxjs';

@Injectable()
export class TransactionTrackingHttpService {
  constructor(private httpClient: HttpClient) {}

  public get(requestId: string): Observable<TransactionTrackingDto> {
    return this.httpClient.get<TransactionTrackingDto>(TRANSACTION_TRACKING_ENDPOINT, { params: { requestId } });
  }

  public getDetails(requestId: string): Observable<TransactionTrackingDetailsDto> {
    return this.httpClient.get<TransactionTrackingDetailsDto>(TRANSACTION_TRACKING_DETAILS_ENDPOINT, { params: { requestId } });
  }

  public getInstructions(requestId: string, type: TransactionTrackingActionTypeDto): Observable<TransactionTrackingInstructionsDto> {
    return this.httpClient.get<TransactionTrackingInstructionsDto>(TRANSACTION_TRACKING_INSTRUCTIONS_ENDPOINT, {
      params: { requestId, type },
    });
  }
}
