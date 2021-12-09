import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CountryOptionsAndDefault } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { DeliveryCountriesService } from '@private/features/delivery/services/countries/delivery-countries/delivery-countries.service';
import { Observable } from 'rxjs';

@Injectable()
export class DeliveryAddressResolver implements Resolve<CountryOptionsAndDefault> {
  constructor(private deliveryCountries: DeliveryCountriesService) {}

  resolve(): Observable<CountryOptionsAndDefault> {
    return this.deliveryCountries.getCountriesAsOptionsAndDefault();
  }
}
