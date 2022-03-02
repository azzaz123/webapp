import { Injectable } from '@angular/core';

import { DeliveryBuyerCalculatorCosts } from '@api/core/model/delivery/buyer/calculator/delivery-buyer-calculator-costs.interface';
import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PayviewStateManagementService {
  private readonly itemHashSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private readonly stateSubject: BehaviorSubject<PayviewState> = new BehaviorSubject<PayviewState>(null);

  constructor(private payviewService: PayviewService) {}

  public set itemHash(value: string) {
    this.itemHashSubject.next(value);
    !!value ? this.getCurrentState(value) : this.stateSubject.next(null);
  }

  public get itemHash$(): Observable<string> {
    return this.itemHashSubject.asObservable();
  }

  public get payViewState$(): Observable<PayviewState> {
    return this.stateSubject.asObservable();
  }

  public refreshPayviewState(): void {
    this.getCurrentState(this.itemHashSubject.getValue());
  }

  public setDeliveryMethod(deliveryMethod: DeliveryBuyerDeliveryMethod): void {
    const payviewState = { ...this.stateSubject.getValue() };
    const subscription: Subscription = this.payviewService
      .getCosts(payviewState.itemDetails.itemHash, payviewState.itemDetails.price, payviewState.costs.promotion?.promocode, deliveryMethod)
      .pipe(take(1))
      .subscribe({
        next: (costs: DeliveryBuyerCalculatorCosts) => {
          payviewState.delivery.methods.current = deliveryMethod;
          payviewState.costs = costs;
          this.stateSubject.next(payviewState);
        },
        error: () => {
          this.stateSubject.next(null);
          subscription.unsubscribe();
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
  }

  private getCurrentState(value: string): void {
    const subscription: Subscription = this.payviewService
      .getCurrentState(value)
      .pipe(take(1))
      .subscribe({
        next: (payviewState: PayviewState) => {
          this.stateSubject.next(payviewState);
        },
        error: () => {
          this.stateSubject.next(null);
          subscription.unsubscribe();
        },
        complete: () => {
          subscription.unsubscribe();
        },
      });
  }
}
