import { Injectable } from '@angular/core';
import { DeliveryCountriesApi } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DeliveryCountriesStoreService {
  private readonly _deliveryCountries: BehaviorSubject<DeliveryCountriesApi> = new BehaviorSubject<DeliveryCountriesApi>(null);

  constructor() {}

  get deliveryCountries(): DeliveryCountriesApi {
    return this._deliveryCountries.getValue();
  }

  get deliveryCountries$(): Observable<DeliveryCountriesApi> {
    return this._deliveryCountries.asObservable();
  }

  set deliveryCountries(locations: DeliveryCountriesApi) {
    this._deliveryCountries.next(locations);
  }
}
