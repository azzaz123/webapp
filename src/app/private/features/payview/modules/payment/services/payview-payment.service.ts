import { Injectable } from '@angular/core';

import { PaymentsPaymentMethod } from '@api/core/model/payments/interfaces/payments-payment-method.interface';
import { PAYVIEW_PAYMENT_EVENT_TYPE } from '@private/features/payview/modules/payment/enums/payview-payment-event-type.enum';
import { PayviewPaymentEvent } from '@private/features/payview/modules/payment/interfaces/payview-payment-event.interface';

import { filter, map } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PayviewPaymentService {
  private paymentSubject: Subject<PayviewPaymentEvent> = new Subject<PayviewPaymentEvent>();

  public on(eventType: PAYVIEW_PAYMENT_EVENT_TYPE, handler: (payload: PaymentsPaymentMethod) => void): Subscription {
    return this.paymentSubject
      .pipe(
        filter((e: PayviewPaymentEvent) => e.type === eventType),
        map((e: PayviewPaymentEvent) => {
          return e.payload;
        })
      )
      .subscribe(handler);
  }

  public editCreditCard(): void {
    this.paymentSubject.next(this.getPaymentEvent(PAYVIEW_PAYMENT_EVENT_TYPE.OPEN_CREDIT_CARD, null));
  }

  public setPaymentMethod(value: PaymentsPaymentMethod): void {
    this.paymentSubject.next(this.getPaymentEvent(PAYVIEW_PAYMENT_EVENT_TYPE.PAYMENT_METHOD_SELECTED, value));
  }

  private getPaymentEvent(type: PAYVIEW_PAYMENT_EVENT_TYPE, payload: PaymentsPaymentMethod | null): PayviewPaymentEvent {
    return { type, payload };
  }
}
