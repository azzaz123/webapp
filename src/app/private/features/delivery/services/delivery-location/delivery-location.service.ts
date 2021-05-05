import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeliveryLocationApiService } from '../api/delivery-location-api/delivery-location-api.service';
import { DeliveryLocationApi } from '@private/features/delivery/interfaces/delivery-location/delivery-location-api.interface';

@Injectable()
export class DeliveryLocationService {
  constructor(private deliveryLocationApiService: DeliveryLocationApiService) {}

  public getLocationByPostalCode(postalCode: string): Observable<DeliveryLocationApi> {
    return this.deliveryLocationApiService.get(postalCode);
  }
}
