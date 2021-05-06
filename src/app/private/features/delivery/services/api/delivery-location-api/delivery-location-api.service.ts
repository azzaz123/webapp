import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
import { Observable } from 'rxjs';

export const DELIVERY_LOCATION_API_URL = (postalCode: string) => `${environment.baseUrl}api/v3/delivery/postal_codes/${postalCode}`;
export const DELIVERY_LOCATION_WITHOUT_PARAMS_API_URL = `${environment.baseUrl}api/v3/delivery/postal_codes`;

@Injectable()
export class DeliveryLocationApiService {
  constructor(private http: HttpClient) {}

  public get(postalCode: string): Observable<DeliveryLocationApi[]> {
    return this.http.get<DeliveryLocationApi[]>(DELIVERY_LOCATION_API_URL(postalCode));
  }

  public getByPostalCodeAndCountry(postalCode: string, countryISOCode: string): Observable<DeliveryLocationApi[]> {
    return this.http.get<DeliveryLocationApi[]>(DELIVERY_LOCATION_WITHOUT_PARAMS_API_URL, {
      params: {
        postal_code: postalCode,
        country_iso_code: countryISOCode,
      },
    });
  }
}
