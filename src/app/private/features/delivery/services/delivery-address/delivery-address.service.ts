import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DeliveryAddressApi } from '../../interfaces/delivery-address/delivery-address-api.interface';
import { DeliveryAddressApiService } from '../api/delivery-address-api/delivery-address-api.service';

@Injectable()
export class DeliveryAddressService {
  private deliveryAddress: BehaviorSubject<DeliveryAddressApi> = new BehaviorSubject<DeliveryAddressApi>(null);

  constructor(private deliveryAddressApiService: DeliveryAddressApiService) {}

  public get(cache = true): Observable<DeliveryAddressApi> {
    if (cache && this.deliveryAddress.value) {
      return this.deliveryAddress.asObservable();
    }

    return this.deliveryAddressApiService.get().pipe(
      tap((address: DeliveryAddressApi) => {
        this.deliveryAddress.next(address);
      })
    );
  }

  public update(newDeliveryAddress: DeliveryAddressApi): Observable<null> {
    return this.deliveryAddressApiService.update(newDeliveryAddress);
  }
}
