import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DeliveryAddressApi } from '../../../interfaces/delivery-address/delivery-address-api.interface';

@Injectable()
export class DeliveryAddressStoreService {
  private readonly _deliveryAddress: BehaviorSubject<DeliveryAddressApi> = new BehaviorSubject<DeliveryAddressApi>(null);

  constructor() {}

  get deliveryAddress(): DeliveryAddressApi {
    return this._deliveryAddress.getValue();
  }

  get deliveryAddress$(): Observable<DeliveryAddressApi> {
    return this._deliveryAddress.asObservable();
  }

  set deliveryAddress(deliveryAddress: DeliveryAddressApi) {
    this._deliveryAddress.next(deliveryAddress);
  }
}
