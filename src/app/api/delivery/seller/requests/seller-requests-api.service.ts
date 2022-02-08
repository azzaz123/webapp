import { Injectable } from '@angular/core';
import { SellerRequest } from '@api/core/model/delivery/seller-requests/seller-request.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SellerRequestDto } from './dtos/seller-request-dto.interface';
import { SellerRequestsHttpService } from './http/seller-requests-http.service';
import { mapSellerRequestDtoToSellerRequest } from './mappers/responses/seller-request.mapper';
import { LocationAccuracy } from '@api/core/model/location/location';

@Injectable({
  providedIn: 'root',
})
export class SellerRequestsApiService {
  constructor(private sellerRequestsHttpService: SellerRequestsHttpService) {}

  public getRequestInfo(requestId: string): Observable<SellerRequest> {
    return this.sellerRequestsHttpService.getRequestInfo(requestId).pipe(
      map((dtoResponse: SellerRequestDto) => {
        return mapSellerRequestDtoToSellerRequest(dtoResponse);
      })
    );
  }

  public cancelRequest(requestId: string): Observable<void> {
    return this.sellerRequestsHttpService.cancelRequest(requestId);
  }

  public acceptRequestPostOfficeDropOff(requestId: string, location: LocationAccuracy): Observable<void> {
    return this.sellerRequestsHttpService.acceptRequestPostOfficeDropOff(requestId, location);
  }

  public acceptRequestHomePickup(requestId: string): Observable<void> {
    return this.sellerRequestsHttpService.acceptRequestHomePickup(requestId);
  }
}
