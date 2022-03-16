import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { DeliveryBuyerDeliveryMethod, DeliveryBuyerDeliveryMethods } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCosts } from '@api/core/model/delivery/costs/delivery-costs.interface';
import { mapToPayviewError } from '@private/features/payview/services/state-management/payview-state-management.mappers';
import { PAYVIEW_EVENT_PAYLOAD } from '@private/features/payview/types/payview-event-payload.type';
import { PAYVIEW_EVENT_TYPE } from '@private/features/payview/enums/payview-event-type.enum';
import { PayviewEvent } from '@private/features/payview/interfaces/payview-event.interface';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';

import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PayviewStateManagementService {
  private readonly actionSubject: Subject<PayviewEvent> = new Subject<PayviewEvent>();
  private readonly itemHashSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private readonly stateSubject: BehaviorSubject<PayviewState> = new BehaviorSubject<PayviewState>(null);

  constructor(private payviewService: PayviewService) {}

  public applyPromocode(value: string): void {
    const payviewState = { ...this.stateSubject.getValue() };
    this.refreshCosts(payviewState, value);
  }

  public set itemHash(value: string) {
    this.itemHashSubject.next(value);
    !!value ? this.getCurrentState(value) : this.stateSubject.next(null);
  }

  public get itemHash$(): Observable<string> {
    return this.itemHashSubject.asObservable();
  }

  public on(eventType: PAYVIEW_EVENT_TYPE, handler: (payload: PAYVIEW_EVENT_PAYLOAD) => void): Subscription {
    return this.actionSubject
      .pipe(
        filter((e: PayviewEvent) => e.type === eventType),
        map((e: PayviewEvent) => {
          return e.payload;
        })
      )
      .subscribe(handler);
  }

  public get payViewState$(): Observable<PayviewState> {
    return this.stateSubject.asObservable();
  }

  public refreshPayviewState(): void {
    this.getCurrentState(this.itemHashSubject.getValue());
  }

  public refreshByDelivery(): void {
    const payviewState = { ...this.stateSubject.getValue() };
    this.refreshDeliveryCosts(payviewState);
    this.refreshDeliveryMethods(payviewState);
    this.refreshCosts(payviewState, null);
  }

  public removePromocode(): void {
    const payviewState = { ...this.stateSubject.getValue() };
    payviewState.costs.promotion = null;
    this.refreshCosts(payviewState, null);
  }

  public setDeliveryMethod(deliveryMethod: DeliveryBuyerDeliveryMethod): void {
    const payviewState: PayviewState = { ...this.stateSubject.getValue() };
    payviewState.delivery.methods.current = deliveryMethod;
    this.refreshCosts(payviewState, null);
  }

  private getActionEvent(type: PAYVIEW_EVENT_TYPE, payload: HttpErrorResponse | null = null): PayviewEvent {
    return { type: type, payload: mapToPayviewError(payload) };
  }

  private getCurrentState(value: string): void {
    const subscription: Subscription = this.payviewService
      .getCurrentState(value)
      .pipe(take(1))
      .subscribe({
        next: (payviewState: PayviewState) => {
          this.stateSubject.next(payviewState);
          this.actionSubject.next(this.getActionEvent(PAYVIEW_EVENT_TYPE.SUCCESS_ON_GET_CURRENT_STATE));
        },
        error: (error: HttpErrorResponse) => {
          this.stateSubject.next(null);
          this.actionSubject.next(this.getActionEvent(PAYVIEW_EVENT_TYPE.ERROR_ON_GET_CURRENT_STATE, error));
          subscription.unsubscribe();
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
  }

  private refreshCosts(payviewState: PayviewState, promocode: string): void {
    const subscription: Subscription = this.payviewService
      .getCosts(
        payviewState.itemDetails.itemHash,
        payviewState.itemDetails.price,
        promocode ?? payviewState.costs.promotion?.promocode,
        payviewState.delivery.methods.current
      )
      .pipe(take(1))
      .subscribe({
        next: (costs: DeliveryBuyerCalculatorCosts) => {
          payviewState.costs = costs;
          this.stateSubject.next(payviewState);
          this.actionSubject.next(this.getActionEvent(PAYVIEW_EVENT_TYPE.SUCCESS_ON_REFRESH_COSTS));
        },
        error: (error: HttpErrorResponse) => {
          this.actionSubject.next(this.getActionEvent(PAYVIEW_EVENT_TYPE.ERROR_ON_REFRESH_COSTS, error));
          subscription.unsubscribe();
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
  }

  private refreshDeliveryCosts(payviewState: PayviewState): void {
    const subscription: Subscription = this.payviewService
      .getDeliveryCosts(payviewState.itemDetails.itemHash)
      .pipe(take(1))
      .subscribe({
        next: (deliveryCosts: DeliveryCosts) => {
          payviewState.delivery.costs = deliveryCosts;
          this.stateSubject.next(payviewState);
          this.actionSubject.next(this.getActionEvent(PAYVIEW_EVENT_TYPE.SUCCESS_ON_REFRESH_DELIVERY_COSTS));
        },
        error: (error: HttpErrorResponse) => {
          this.actionSubject.next(this.getActionEvent(PAYVIEW_EVENT_TYPE.ERROR_ON_REFRESH_DELIVERY_COSTS, error));
          subscription.unsubscribe();
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
  }

  private refreshDeliveryMethods(payviewState: PayviewState): void {
    const subscription: Subscription = this.payviewService
      .getDeliveryMethods(payviewState.itemDetails.itemHash)
      .pipe(take(1))
      .subscribe({
        next: (deliveryMethods: DeliveryBuyerDeliveryMethods) => {
          payviewState.delivery.methods = deliveryMethods;
          this.actionSubject.next(this.getActionEvent(PAYVIEW_EVENT_TYPE.SUCCESS_ON_REFRESH_DELIVERY_METHODS));
          this.stateSubject.next(payviewState);
        },
        error: (error: HttpErrorResponse) => {
          this.actionSubject.next(this.getActionEvent(PAYVIEW_EVENT_TYPE.ERROR_ON_REFRESH_DELIVERY_METHODS, error));
          subscription.unsubscribe();
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
  }
}
