import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliveryLocationsApiService } from '../../api/delivery-locations-api/delivery-locations-api.service';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
@Injectable()
export class DeliveryLocationsService {
  constructor(private deliveryLocationsApiService: DeliveryLocationsApiService) {}

  public getLocationsByPostalCodeAndCountry(postalCode: string, countryISOCode: string): Observable<DeliveryLocationApi[]> {
    return this.deliveryLocationsApiService.getByPostalCodeAndCountry(postalCode, countryISOCode);
  }
}
