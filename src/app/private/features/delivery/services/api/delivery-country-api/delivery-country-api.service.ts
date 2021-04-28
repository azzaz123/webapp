import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.beta';
import { DeliveryCountryApi } from '@private/features/delivery/interfaces/delivery-country/delivery-country-api.interface';
import { Observable } from 'rxjs';

export const DELIVERY_COUNTRY_API_URL = (postalCode: string) => `${environment.baseUrl}api/v3/delivery/postal_codes/${postalCode}`;

@Injectable()
export class DeliveryCountryApiService {
  constructor(private http: HttpClient) {}

  get(postalCode: string): Observable<DeliveryCountryApi> {
    return this.http.get<DeliveryCountryApi>(DELIVERY_COUNTRY_API_URL(postalCode));
  }
}
