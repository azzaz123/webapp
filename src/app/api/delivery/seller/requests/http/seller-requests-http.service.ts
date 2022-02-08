import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SellerRequestDto } from '../dtos/seller-request-dto.interface';
import { APP_VERSION } from '@environments/version';
import { LocationAccuracy } from '@api/core/model/location/location';
import {
  SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID,
  SELLER_REQUESTS_ACCEPT_POST_OFFICE_DROP_OFF_ENDPOINT_WITH_REQUEST_ID,
  SELLER_REQUESTS_ACCEPT_HOME_PICKUP_ENDPOINT_WITH_REQUEST_ID,
} from './endpoints';
import { ACCEPT_LOCATION_HEADERS } from './seller-requests-location-headers.enum';

@Injectable({
  providedIn: 'root',
})
export class SellerRequestsHttpService {
  constructor(private http: HttpClient) {}

  public getRequestInfo(requestId: string): Observable<SellerRequestDto> {
    return this.http.get<SellerRequestDto>(SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID(requestId));
  }

  public cancelRequest(requestId: string): Observable<void> {
    return this.http.patch<void>(SELLER_REQUESTS_ENDPOINT_WITH_REQUEST_ID(requestId), null);
  }

  public acceptRequestPostOfficeDropOff(requestId: string, location: LocationAccuracy): Observable<void> {
    const headers: HttpHeaders = this.getLocationAndAppVersionHeaders(location);
    return this.http.post<void>(SELLER_REQUESTS_ACCEPT_POST_OFFICE_DROP_OFF_ENDPOINT_WITH_REQUEST_ID(requestId), null, { headers });
  }

  public acceptRequestHomePickup(requestId: string): Observable<void> {
    return this.http.post<void>(SELLER_REQUESTS_ACCEPT_HOME_PICKUP_ENDPOINT_WITH_REQUEST_ID(requestId), null);
  }

  private getLocationAndAppVersionHeaders(location: LocationAccuracy): HttpHeaders {
    return new HttpHeaders({
      [ACCEPT_LOCATION_HEADERS.ACCURACY]: location.accuracy.toString(),
      [ACCEPT_LOCATION_HEADERS.LATITUDE]: location.latitude.toString(),
      [ACCEPT_LOCATION_HEADERS.LONGITUDE]: location.longitude.toString(),
      'X-AppVersion': APP_VERSION.replace(/\./g, ''),
    });
  }
}
