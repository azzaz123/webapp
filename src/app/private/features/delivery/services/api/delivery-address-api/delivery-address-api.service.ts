import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import {
  DeliveryAddressErrorMapper,
  DeliveryAddressErrorResponse,
} from '@private/features/delivery/errors/mappers/address/delivery-address-error-mapper';
import { DeliveryAddressApi } from '@private/features/delivery/interfaces/delivery-address/delivery-address-api.interface';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const ADDRESS_ACCEPT_HEADER = (action: 'get' | 'create' | 'update') => {
  return { Accept: `application/vnd.${action}.address.v2+json` };
};
export const DELIVERY_ADDRESS_API_URL = `${environment.baseUrl}api/v3/delivery/addresses/main/`;
export const DELIVERY_ADDRESS_ID = (addressId: string) => `${DELIVERY_ADDRESS_API_URL}${addressId}`;

@Injectable()
export class DeliveryAddressApiService {
  private errorMapper: DeliveryAddressErrorMapper = new DeliveryAddressErrorMapper();

  constructor(private http: HttpClient) {}

  public get(): Observable<DeliveryAddressApi> {
    return this.http.get<DeliveryAddressApi>(DELIVERY_ADDRESS_API_URL, { headers: ADDRESS_ACCEPT_HEADER('get') });
  }

  public create(address: DeliveryAddressApi): Observable<null> {
    return this.http
      .post<null>(DELIVERY_ADDRESS_API_URL, address, { headers: ADDRESS_ACCEPT_HEADER('create') })
      .pipe(catchError((error: DeliveryAddressErrorResponse) => this.errorMapper.map(error)));
  }

  public update(address: DeliveryAddressApi): Observable<null> {
    return this.http
      .put<null>(DELIVERY_ADDRESS_API_URL, address, { headers: ADDRESS_ACCEPT_HEADER('update') })
      .pipe(catchError((error: DeliveryAddressErrorResponse) => this.errorMapper.map(error)));
  }

  public delete(id: string): Observable<null> {
    return this.http.delete<null>(DELIVERY_ADDRESS_ID(id));
  }
}
