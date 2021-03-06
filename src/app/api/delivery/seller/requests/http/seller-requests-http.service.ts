import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SellerRequestDto } from '../dtos/seller-request-dto.interface';
import { APP_VERSION } from '@environments/version';
import {
  SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID,
  SELLER_REQUESTS_ACCEPT_POST_OFFICE_DROP_OFF_ENDPOINT_WITH_REQUEST_ID,
  SELLER_REQUESTS_ACCEPT_HOME_PICKUP_ENDPOINT_WITH_REQUEST_ID,
  SELLER_REQUESTS_ENDPOINT,
} from './endpoints';
import { mapBuyerAndItemHashToSellerRequestsParams } from '../mappers/requests/seller-requests-params.mapper';
import { UuidService } from '@core/uuid/uuid.service';

@Injectable({
  providedIn: 'root',
})
export class SellerRequestsHttpService {
  constructor(private http: HttpClient, private uuidService: UuidService) {}

  public getRequestsByBuyerAndItem(buyerHash: string, itemHash: string): Observable<SellerRequestDto[]> {
    const params: HttpParams = mapBuyerAndItemHashToSellerRequestsParams({ buyerHash, itemHash });
    return this.http.get<SellerRequestDto[]>(SELLER_REQUESTS_ENDPOINT, { params });
  }

  public getRequestInfo(requestId: string): Observable<SellerRequestDto> {
    return this.http.get<SellerRequestDto>(SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID(requestId));
  }

  public rejectRequest(requestId: string): Observable<void> {
    return this.http.patch<void>(SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID(requestId), {
      status: 'rejected',
    });
  }

  public acceptRequestPostOfficeDropOff(requestId: string): Observable<void> {
    return this.http.post<void>(
      SELLER_REQUESTS_ACCEPT_POST_OFFICE_DROP_OFF_ENDPOINT_WITH_REQUEST_ID(requestId),
      this.getBodyWithTransactionId(),
      this.getHeaders()
    );
  }

  public acceptRequestHomePickup(requestId: string): Observable<void> {
    return this.http.post<void>(
      SELLER_REQUESTS_ACCEPT_HOME_PICKUP_ENDPOINT_WITH_REQUEST_ID(requestId),
      this.getBodyWithTransactionId(),
      this.getHeaders()
    );
  }

  private getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        'X-AppVersion': APP_VERSION.replace(/\./g, ''),
      }),
    };
  }

  private getBodyWithTransactionId(): { transaction_id: string } {
    return {
      transaction_id: this.uuidService.getUUID(),
    };
  }
}
