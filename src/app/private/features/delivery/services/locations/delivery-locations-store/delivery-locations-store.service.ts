import { Injectable } from '@angular/core';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DeliveryLocationsStoreService {
  private readonly _deliveryLocations: BehaviorSubject<DeliveryLocationApi[]> = new BehaviorSubject<DeliveryLocationApi[]>([]);

  constructor() {}

  get deliveryLocations(): DeliveryLocationApi[] {
    return this._deliveryLocations.getValue();
  }

  get deliveryLocations$(): Observable<DeliveryLocationApi[]> {
    return this._deliveryLocations.asObservable();
  }

  set deliveryLocations(locations: DeliveryLocationApi[]) {
    this._deliveryLocations.next(locations);
  }
}
