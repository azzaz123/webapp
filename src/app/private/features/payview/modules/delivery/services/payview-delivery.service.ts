import { Injectable } from '@angular/core';

import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';

import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PayviewDeliveryService {
  private deliveryMethodSubject: Subject<DeliveryBuyerDeliveryMethod> = new Subject<DeliveryBuyerDeliveryMethod>();

  constructor() {}

  public get deliveryMethodSelected(): Observable<DeliveryBuyerDeliveryMethod> {
    return this.deliveryMethodSubject.asObservable();
  }

  public setDeliveryMethod(value: DeliveryBuyerDeliveryMethod): void {
    this.deliveryMethodSubject.next(value);
  }
}
