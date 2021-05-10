import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DeliveryAddressApi } from '../../../interfaces/delivery-address/delivery-address-api.interface';
import { DeliveryAddressApiService } from '../../api/delivery-address-api/delivery-address-api.service';
import { DeliveryAddressStoreService } from '../delivery-address-store/delivery-address-store.service';

@Injectable()
export class DeliveryAddressService {
  constructor(
    private deliveryAddressApiService: DeliveryAddressApiService,
    private deliveryAddressStoreService: DeliveryAddressStoreService
  ) {}

  public get(cache = true): Observable<DeliveryAddressApi> {
    if (cache && this.deliveryAddressStoreService.deliveryAddress) {
      return this.deliveryAddressStoreService.deliveryAddress$;
    }

    return this.deliveryAddressApiService.get().pipe(
      tap((address: DeliveryAddressApi) => {
        this.deliveryAddressStoreService.deliveryAddress = address;
      })
    );
  }

  public updateOrCreate(newDeliveryAddress: DeliveryAddressApi, isNewAddress: boolean): Observable<null> {
    if (isNewAddress) {
      return this.deliveryAddressApiService.create(newDeliveryAddress);
    }
    return this.deliveryAddressApiService.update(newDeliveryAddress);
  }
}
