import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import {
  DeliveryPostalCodesErrorMapper,
  DeliveryPostalCodesErrorResponse,
} from '@private/features/delivery/errors/mappers/postal-codes/delivery-postal-codes.error-mapper';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const DELIVERY_LOCATIONS_API_URL = `${environment.baseUrl}api/v3/delivery/postal_codes`;

@Injectable()
export class DeliveryLocationsApiService {
  private errorMapper: DeliveryPostalCodesErrorMapper = new DeliveryPostalCodesErrorMapper();

  constructor(private http: HttpClient) {}

  public getByPostalCodeAndCountry(postalCode: string, countryISOCode: string): Observable<DeliveryLocationApi[]> | Observable<never> {
    return this.http
      .get<DeliveryLocationApi[]>(DELIVERY_LOCATIONS_API_URL, {
        params: {
          postal_code: postalCode,
          country_iso_code: countryISOCode,
        },
      })
      .pipe(catchError((networkError: DeliveryPostalCodesErrorResponse) => this.errorMapper.map(networkError)));
  }
}
