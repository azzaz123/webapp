import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { APP_VERSION } from '@environments/version';
import { DeliveryCountriesApi } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { Observable } from 'rxjs';

export const DELIVERY_COUNTRIES_API_URL = `${environment.baseUrl}api/v3/delivery/countries/`;

@Injectable()
export class DeliveryCountriesApiService {
  constructor(private http: HttpClient) {}

  public get(): Observable<DeliveryCountriesApi> {
    return this.http.get<DeliveryCountriesApi>(DELIVERY_COUNTRIES_API_URL, {
      headers: { 'X-AppVersion': APP_VERSION.replace(/\./g, '') },
    });
  }
}
