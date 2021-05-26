import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
import { Observable } from 'rxjs';

export const DELIVERY_LOCATIONS_API_URL = `${environment.baseUrl}api/v3/delivery/postal_codes`;

@Injectable()
export class DeliveryLocationsApiService {
  constructor(private http: HttpClient) {}

  public getByPostalCodeAndCountry(postalCode: string, countryISOCode: string): Observable<DeliveryLocationApi[]> {
    return this.http.get<DeliveryLocationApi[]>(DELIVERY_LOCATIONS_API_URL, {
      params: {
        postal_code: postalCode,
        country_iso_code: countryISOCode,
      },
    });
  }
}
