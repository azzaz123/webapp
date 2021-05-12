import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliveryLocationsApiService } from '../../api/delivery-locations-api/delivery-locations-api.service';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
import { tap } from 'rxjs/operators';
import { DeliveryLocationsStoreService } from '../delivery-locations-store/delivery-locations-store.service';

@Injectable()
export class DeliveryLocationsService {
  constructor(
    private deliveryLocationsApiService: DeliveryLocationsApiService,
    private deliveryLocationsStoreService: DeliveryLocationsStoreService
  ) {}

  public getLocationsByPostalCode(postalCode: string): Observable<DeliveryLocationApi[]> {
    return this.deliveryLocationsApiService.get(postalCode).pipe(tap((locations) => this.updateLocations(locations)));
  }

  public getLocationsByPostalCodeAndCountry(postalCode: string, countryISOCode): Observable<DeliveryLocationApi[]> {
    return this.deliveryLocationsApiService
      .getByPostalCodeAndCountry(postalCode, countryISOCode)
      .pipe(tap((locations) => this.updateLocations(locations)));
  }

  private updateLocations(locations: DeliveryLocationApi[]): void {
    this.deliveryLocationsStoreService.deliveryLocations = locations;
  }
}
