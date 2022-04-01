import { Injectable } from '@angular/core';

import { PAYVIEW_BUY_EVENT_TYPE } from '@private/features/payview/modules/buy/enums/payview-buy-event-type.enum';
import { PayviewBuyEvent } from '@private/features/payview/modules/buy/interfaces/payview-buy-event.interface';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';

import { filter, map } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PayviewBuyService {
  private eventBusSubject: Subject<PayviewBuyEvent> = new Subject<PayviewBuyEvent>();

  public on(eventType: PAYVIEW_BUY_EVENT_TYPE, handler: (payload: string | PayviewError | null) => void): Subscription {
    return this.eventBusSubject
      .pipe(
        filter((e: PayviewBuyEvent) => e.type === eventType),
        map((e: PayviewBuyEvent) => {
          return e.payload;
        })
      )
      .subscribe(handler);
  }

  public buy(): void {
    this.eventBusSubject.next(this.getBuyEvent(PAYVIEW_BUY_EVENT_TYPE.BUY, null));
  }

  public error(error: PayviewError): void {
    this.eventBusSubject.next(this.getBuyEvent(PAYVIEW_BUY_EVENT_TYPE.ERROR, error));
  }

  private getBuyEvent(type: PAYVIEW_BUY_EVENT_TYPE, payload: string | null | PayviewError): PayviewBuyEvent {
    return { type, payload };
  }
}
