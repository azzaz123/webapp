import { Injectable } from '@angular/core';

import { PAYVIEW_PROMOTION_EVENT_TYPE } from '@private/features/payview/modules/promotion/enums/payview-promotion-event-type.enum';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';
import { PayviewPromotionEvent } from '@private/features/payview/modules/promotion/interfaces/payview-promotion-event.interface';

import { filter, map } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PayviewPromotionService {
  private eventBusSubject: Subject<PayviewPromotionEvent> = new Subject<PayviewPromotionEvent>();

  constructor() {}

  public on(eventType: PAYVIEW_PROMOTION_EVENT_TYPE, handler: (payload: string | PayviewError | null) => void): Subscription {
    return this.eventBusSubject
      .pipe(
        filter((e: PayviewPromotionEvent) => e.type === eventType),
        map((e: PayviewPromotionEvent) => {
          return e.payload;
        })
      )
      .subscribe(handler);
  }

  public applyPromocode(value: string): void {
    this.eventBusSubject.next(this.getPromotionEvent(PAYVIEW_PROMOTION_EVENT_TYPE.APPLY_PROMOCODE, value));
  }

  public error(error: PayviewError): void {
    this.eventBusSubject.next(this.getPromotionEvent(PAYVIEW_PROMOTION_EVENT_TYPE.ERROR, error));
  }

  public openPromocodeEditor(): void {
    this.eventBusSubject.next(this.getPromotionEvent(PAYVIEW_PROMOTION_EVENT_TYPE.OPEN_PROMOCODE_EDITOR, null));
  }

  public removePromocode(): void {
    this.eventBusSubject.next(this.getPromotionEvent(PAYVIEW_PROMOTION_EVENT_TYPE.REMOVE_PROMOCODE, null));
  }

  private getPromotionEvent(type: PAYVIEW_PROMOTION_EVENT_TYPE, payload: string | null | PayviewError): PayviewPromotionEvent {
    return { type, payload };
  }
}
