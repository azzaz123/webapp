import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliveryLocationApiService } from '../../api/delivery-location-api/delivery-location-api.service';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
import { tap } from 'rxjs/operators';
import { DeliveryLocationsStoreService } from '../delivery-location-store/delivery-location-store.service';

@Injectable()
export class DeliveryLocationsService {
  constructor(
    private deliveryLocationApiService: DeliveryLocationApiService,
    private deliveryLocationsStoreService: DeliveryLocationsStoreService
  ) {}

  public getLocationsByPostalCode(postalCode: string): Observable<DeliveryLocationApi[]> {
    return this.deliveryLocationApiService.get(postalCode).pipe(tap((locations) => this.updateLocations(locations)));
  }

  public getLocationsByPostalCodeAndCountry(postalCode: string, countryISOCode): Observable<DeliveryLocationApi[]> {
    return this.deliveryLocationApiService
      .getByPostalCodeAndCountry(postalCode, countryISOCode)
      .pipe(tap((locations) => this.updateLocations(locations)));
  }

  private updateLocations(locations: DeliveryLocationApi[]): void {
    this.deliveryLocationsStoreService.deliveryLocations = locations;
  }
}
