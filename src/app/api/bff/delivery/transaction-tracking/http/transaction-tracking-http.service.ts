import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { APP_VERSION } from '@environments/version';
import {
  TransactionTrackingActionTypeDto,
  TransactionTrackingDetailsDto,
  TransactionTrackingDto,
  TransactionTrackingInstructionsDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';
import {
  TRANSACTION_TRACKING_CANCEL_TRANSACTION_ENDPOINT,
  TRANSACTION_TRACKING_DETAILS_ENDPOINT,
  TRANSACTION_TRACKING_ENDPOINT,
  TRANSACTION_TRACKING_EXPIRE_CLAIM_PERIOD_ENDPOINT,
  TRANSACTION_TRACKING_INSTRUCTIONS_ENDPOINT,
  TRANSACTION_TRACKING_PACKAGE_RECEIVED_ENDPOINT,
} from '@api/bff/delivery/transaction-tracking/http/endpoints';

import { Observable } from 'rxjs';

@Injectable()
export class TransactionTrackingHttpService {
  constructor(private httpClient: HttpClient) {}

  public get(requestId: string): Observable<TransactionTrackingDto> {
    return this.httpClient.get<TransactionTrackingDto>(TRANSACTION_TRACKING_ENDPOINT, {
      params: { requestId },
      headers: this.getHeaders,
    });
  }

  public getDetails(requestId: string): Observable<TransactionTrackingDetailsDto> {
    return this.httpClient.get<TransactionTrackingDetailsDto>(TRANSACTION_TRACKING_DETAILS_ENDPOINT, {
      params: { requestId },
      headers: this.getHeaders,
    });
  }

  public getInstructions(requestId: string, type: TransactionTrackingActionTypeDto): Observable<TransactionTrackingInstructionsDto> {
    return this.httpClient.get<TransactionTrackingInstructionsDto>(TRANSACTION_TRACKING_INSTRUCTIONS_ENDPOINT, {
      params: { requestId, type },
      headers: this.getHeaders,
    });
  }

  public sendCancelTransaction(requestId: string): Observable<void> {
    return this.httpClient.delete<void>(this.getEndpointFromRequestId(TRANSACTION_TRACKING_CANCEL_TRANSACTION_ENDPOINT, requestId), {
      headers: this.getHeaders,
    });
  }

  public sendExpireClaimPeriod(requestId: string): Observable<void> {
    return this.httpClient.patch<void>(this.getEndpointFromRequestId(TRANSACTION_TRACKING_EXPIRE_CLAIM_PERIOD_ENDPOINT, requestId), {
      headers: this.getHeaders,
    });
  }

  public sendPackageArrived(requestId: string): Observable<void> {
    return this.httpClient.post<void>(this.getEndpointFromRequestId(TRANSACTION_TRACKING_PACKAGE_RECEIVED_ENDPOINT, requestId), {
      headers: this.getHeaders,
    });
  }

  private getEndpointFromRequestId(endpoint: string, requestId: string): string {
    return endpoint.replace(/\{0\}/g, requestId);
  }

  private get getHeaders(): { [header: string]: string | string[] } {
    return { 'X-AppVersion': APP_VERSION.replace(/\./g, '') };
  }
}
