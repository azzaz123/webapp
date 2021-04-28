import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.beta';
import { DeliveryAddressResponse } from '@private/features/delivery/interfaces/delivery-address/delivery-address-response.interface';
import { DeliveryAddress } from '@private/features/delivery/interfaces/delivery-address/delivery-address.interface';
import { Observable } from 'rxjs';

const DELIVERY_ADDRESS_API_URL = `${environment.baseUrl}api/v3/delivery/addresses/`;
export const MAIN_DELIVERY_ADDRESS = `${DELIVERY_ADDRESS_API_URL}main`;
export const DELIVERY_ADDRESS_ID = (addressId: string) => `${DELIVERY_ADDRESS_API_URL}main/${addressId}`;

@Injectable()
export class DeliveryAddressApiService {
  constructor(private http: HttpClient) {}

  public getDeliveryAddress(): Observable<DeliveryAddressResponse> {
    return this.http.get<any>(MAIN_DELIVERY_ADDRESS);
  }

  public createDeliveryAddress(address: DeliveryAddress): Observable<any> {
    return this.http.post<any>(MAIN_DELIVERY_ADDRESS, { address });
  }

  public updateDeliveryAddress(address: DeliveryAddress): Observable<any> {
    return this.http.put<any>(MAIN_DELIVERY_ADDRESS, { address });
  }

  public deleteDeliveryAddress(addressId: string): Observable<any> {
    return this.http.delete<any>(DELIVERY_ADDRESS_ID(addressId));
  }
}
