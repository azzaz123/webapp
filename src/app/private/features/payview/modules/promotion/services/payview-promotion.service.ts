import { Injectable } from '@angular/core';

import { PayviewPromotionEvent } from '@private/features/payview/modules/promotion/interfaces/payview-promotion-event.interface';
import { PayviewPromotionEventType } from '@private/features/payview/modules/promotion/enums/payview-promotion-event-type.interface';

import { filter, map } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PayviewPromotionService {
  private eventBusSubject: Subject<PayviewPromotionEvent> = new Subject<PayviewPromotionEvent>();

  constructor() {}

  public on(eventType: PayviewPromotionEventType, handler: (payload: string) => void): Subscription {
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
    this.eventBusSubject.next(this.getPromotionEvent(PayviewPromotionEventType.ApplyPromocode, value));
  }

  public deletePromocode(): void {
    this.eventBusSubject.next(this.getPromotionEvent(PayviewPromotionEventType.DeletePromocode, null));
  }

  public openPromocodeEditor(): void {
    this.eventBusSubject.next(this.getPromotionEvent(PayviewPromotionEventType.OpenPromocodeEditor, null));
  }

  private getPromotionEvent(type: PayviewPromotionEventType, payload: string | null): PayviewPromotionEvent {
    return { type, payload };
  }
}
