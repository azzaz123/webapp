import { Injectable } from '@angular/core';
import { CountryOptionsAndDefault } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DeliveryCountriesStoreService {
  private readonly _deliveryCountriesAndDefault: BehaviorSubject<CountryOptionsAndDefault> = new BehaviorSubject<CountryOptionsAndDefault>(
    null
  );

  constructor() {}

  get deliveryCountriesAndDefault(): CountryOptionsAndDefault {
    return this._deliveryCountriesAndDefault.getValue();
  }

  get deliveryCountriesAndDefault$(): Observable<CountryOptionsAndDefault> {
    return this._deliveryCountriesAndDefault.asObservable();
  }

  set deliveryCountriesAndDefault(locations: CountryOptionsAndDefault) {
    this._deliveryCountriesAndDefault.next(locations);
  }
}
