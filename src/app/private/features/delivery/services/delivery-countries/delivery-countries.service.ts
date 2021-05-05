import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DeliveryCountriesApi } from '../../interfaces/delivery-countries/delivery-countries-api.interface';
import { DeliveryCountriesApiService } from '../api/delivery-countries-api/delivery-countries-api.service';

@Injectable()
export class DeliveryCountriesService {
  private deliveryCountries: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private deliveryCountriesApiService: DeliveryCountriesApiService) {}

  public get(cache = true): Observable<DeliveryCountriesApi> {
    if (cache && this.deliveryCountries.value) {
      return this.deliveryCountries.asObservable();
    }
    return this.deliveryCountriesApiService.get().pipe(
      tap((countries: DeliveryCountriesApi) => {
        this.deliveryCountries.next(countries);
      })
    );
  }
}
