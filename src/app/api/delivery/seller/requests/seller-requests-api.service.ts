import { Injectable } from '@angular/core';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AcceptRequestErrorResponse } from './dtos/errors';
import { SellerRequestDto } from './dtos/seller-request-dto.interface';
import { SellerRequestsHttpService } from './http/seller-requests-http.service';
import { AcceptRequestErrorMapper } from './mappers/errors/accept-request/accept-request-error-mapper';
import { mapSellerRequestDtoToSellerRequest } from './mappers/responses/seller-request.mapper';

@Injectable({
  providedIn: 'root',
})
export class SellerRequestsApiService {
  private errorMapper: AcceptRequestErrorMapper = new AcceptRequestErrorMapper();
  constructor(private sellerRequestsHttpService: SellerRequestsHttpService) {}

  public getRequestsByBuyerAndItem(buyerHash: string, itemHash: string): Observable<SellerRequest[]> {
    return this.sellerRequestsHttpService.getRequestsByBuyerAndItem(buyerHash, itemHash).pipe(
      map((dtoResponse: SellerRequestDto[]) => {
        return dtoResponse.map((sellerRequest) => mapSellerRequestDtoToSellerRequest(sellerRequest));
      })
    );
  }

  public getRequestInfo(requestId: string): Observable<SellerRequest> {
    return this.sellerRequestsHttpService.getRequestInfo(requestId).pipe(
      map((dtoResponse: SellerRequestDto) => {
        return mapSellerRequestDtoToSellerRequest(dtoResponse);
      })
    );
  }

  public rejectRequest(requestId: string): Observable<void> {
    return this.sellerRequestsHttpService.rejectRequest(requestId);
  }

  public acceptRequestPostOfficeDropOff(requestId: string): Observable<void> {
    return this.sellerRequestsHttpService
      .acceptRequestPostOfficeDropOff(requestId)
      .pipe(catchError((error: AcceptRequestErrorResponse) => this.errorMapper.map(error)));
  }

  public acceptRequestHomePickup(requestId: string): Observable<void> {
    return this.sellerRequestsHttpService
      .acceptRequestHomePickup(requestId)
      .pipe(catchError((error: AcceptRequestErrorResponse) => this.errorMapper.map(error)));
  }
}
