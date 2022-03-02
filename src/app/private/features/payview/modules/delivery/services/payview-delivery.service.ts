import { Injectable } from '@angular/core';

import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { PayviewDeliveryEvent } from '@private/features/payview/modules/delivery/interfaces/payview-delivery-event.interface';
import { PayviewDeliveryEventType } from '@private/features/payview/modules/delivery/enums/payview-delivery-event-type.interface';

import { filter, map } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PayviewDeliveryService {
  private deliveryMethodSubject: Subject<PayviewDeliveryEvent> = new Subject<PayviewDeliveryEvent>();

  constructor() {}

  // public on(eventType: PayviewDeliveryEventType, callback: (payload: DeliveryBuyerDeliveryMethod) => void): Subscription {
  public on(eventType: PayviewDeliveryEventType, handler: (payload: DeliveryBuyerDeliveryMethod) => void): Subscription {
    return this.deliveryMethodSubject
      .pipe(
        filter((e: PayviewDeliveryEvent) => e.type === eventType),
        map((e: PayviewDeliveryEvent) => {
          return e.payload;
        })
      )
      .subscribe(handler);
  }

  public editAddress(): void {
    this.deliveryMethodSubject.next(this.getDeliveryEvent(PayviewDeliveryEventType.OpenAddressScreen, null));
  }

  public editPickUpPoint(): void {
    this.deliveryMethodSubject.next(this.getDeliveryEvent(PayviewDeliveryEventType.OpenPickUpPointMap, null));
  }

  public setDeliveryMethod(value: DeliveryBuyerDeliveryMethod): void {
    this.deliveryMethodSubject.next(this.getDeliveryEvent(PayviewDeliveryEventType.DeliveryMethodSelected, value));
  }

  private getDeliveryEvent(type: PayviewDeliveryEventType, payload: DeliveryBuyerDeliveryMethod | null): PayviewDeliveryEvent {
    return { type, payload };
  }
}
