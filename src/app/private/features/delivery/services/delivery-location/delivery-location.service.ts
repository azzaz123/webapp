import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DeliveryLocationApiService } from '../api/delivery-location-api/delivery-location-api.service';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
import { tap } from 'rxjs/operators';

@Injectable()
export class DeliveryLocationService {
  private deliveryLocations: BehaviorSubject<DeliveryLocationApi[]> = new BehaviorSubject<DeliveryLocationApi[]>(null);

  constructor(private deliveryLocationApiService: DeliveryLocationApiService) {}

  public getLocationsByPostalCode(postalCode: string): Observable<DeliveryLocationApi[]> {
    return this.deliveryLocationApiService.get(postalCode).pipe(tap((locations) => this.deliveryLocations.next(locations)));
  }
}
