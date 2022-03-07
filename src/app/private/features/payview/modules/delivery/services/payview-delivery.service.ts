import { Injectable } from '@angular/core';

import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { PayviewDeliveryEvent } from '@private/features/payview/modules/delivery/interfaces/payview-delivery-event.interface';
import { PAYVIEW_DELIVERY_EVENT_TYPE } from '@private/features/payview/modules/delivery/enums/payview-delivery-event-type.enum';

import { filter, map } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PayviewDeliveryService {
  private deliveryMethodSubject: Subject<PayviewDeliveryEvent> = new Subject<PayviewDeliveryEvent>();

  public on(eventType: PAYVIEW_DELIVERY_EVENT_TYPE, handler: (payload: DeliveryBuyerDeliveryMethod) => void): Subscription {
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
    this.deliveryMethodSubject.next(this.getDeliveryEvent(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN, null));
  }

  public editPickUpPoint(): void {
    this.deliveryMethodSubject.next(this.getDeliveryEvent(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_PICK_UP_POINT_MAP, null));
  }

  public setDeliveryMethod(value: DeliveryBuyerDeliveryMethod): void {
    this.deliveryMethodSubject.next(this.getDeliveryEvent(PAYVIEW_DELIVERY_EVENT_TYPE.DELIVERY_METHOD_SELECTED, value));
  }

  private getDeliveryEvent(type: PAYVIEW_DELIVERY_EVENT_TYPE, payload: DeliveryBuyerDeliveryMethod | null): PayviewDeliveryEvent {
    return { type, payload };
  }
}
