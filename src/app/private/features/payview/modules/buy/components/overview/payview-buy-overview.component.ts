import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { PAYVIEW_BUY_DEFAULT_ERROR, PAYVIEW_BUY_ERRORS } from '@private/features/payview/modules/buy/constants/payview-buy-copies';
import { PAYVIEW_BUY_EVENT_TYPE } from '@private/features/payview/modules/buy/enums/payview-buy-event-type.enum';
import { PayviewBuyService } from '@private/features/payview/modules/buy/services/payview-buy.service';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';

import { Subscription } from 'rxjs';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { PayviewStateDelivery } from '@private/features/payview/interfaces/payview-state-delivery.interface';
import { DELIVERY_MODE } from '@api/core/model/delivery/delivery-mode.type';
import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { PAYVIEW_PAYMENT_METHOD } from '@api/core/model/payments';

@Component({
  selector: 'tsl-payview-buy-overview',
  templateUrl: './payview-buy-overview.component.html',
  styleUrls: ['./payview-buy-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayviewBuyOverviewComponent implements OnDestroy, OnInit {
  @Input() payviewState: PayviewState;
  public errorMessage: string;

  private subscription: Subscription;

  constructor(private buyService: PayviewBuyService, private changeDetectorRef: ChangeDetectorRef) {}

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  public ngOnInit(): void {
    this.subscribe();
  }

  public buy(): void {
    this.checkPrePaymentConditions();
    this.buyService.buy();
  }

  public checkPrePaymentConditions() {
    if (!this.payviewState) {
      return 'unknown error';
    }
    this.checkDeliveryMethodConditions(this.payviewState.delivery);
    if (!this.payviewState.payment.preferences.preferences) {
      return 'no payment selected';
    }
    if (this.selectedPaymentMethodIsAnEmptyCard) {
      return 'payment info missing';
    }
  }

  private checkDeliveryMethodConditions(deliveryMethods: PayviewStateDelivery) {
    const selectedCarrier: DeliveryBuyerDeliveryMethod = deliveryMethods.methods.current;
    if (!deliveryMethods.methods.current) {
      return 'no delivery method selected';
    }
    if (!selectedCarrier.lastAddressUsed) {
      if (selectedCarrier.method === DELIVERY_MODE.BUYER_ADDRESS) {
        return 'empty buyer address';
      }
      if (selectedCarrier.method === DELIVERY_MODE.CARRIER_OFFICE) {
        return 'empty post office address';
      }
    }
    if (selectedCarrier.method === DELIVERY_MODE.CARRIER_OFFICE && !deliveryMethods.address) {
      return 'empty post office return address';
    }
  }

  private get selectedPaymentMethodIsAnEmptyCard(): boolean {
    return (
      this.payviewState.payment.preferences.preferences.paymentMethod === PAYVIEW_PAYMENT_METHOD.CREDIT_CARD &&
      !this.payviewState.payment.card
    );
  }

  private getErrorMessage(error: PayviewError): string {
    return PAYVIEW_BUY_ERRORS[error.code] ?? PAYVIEW_BUY_DEFAULT_ERROR;
  }

  private subscribe(): void {
    this.subscription = this.buyService.on(PAYVIEW_BUY_EVENT_TYPE.ERROR, (error: PayviewError) => {
      this.errorMessage = this.getErrorMessage(error);
      this.changeDetectorRef.detectChanges();
    });
  }

  private unsubscribe(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
