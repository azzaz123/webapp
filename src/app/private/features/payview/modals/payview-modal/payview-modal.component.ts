import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { CountryOptionsAndDefault } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { DELIVERY_ADDRESS_PREVIOUS_PAGE } from '@private/features/delivery/enums/delivery-address-previous-pages.enum';
import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCountriesService } from '@private/features/delivery/services/countries/delivery-countries/delivery-countries.service';
import { PaymentsPaymentMethod } from '@api/core/model/payments/interfaces/payments-payment-method.interface';
import { PAYVIEW_DELIVERY_EVENT_TYPE } from '@private/features/payview/modules/delivery/enums/payview-delivery-event-type.enum';
import { PAYVIEW_EVENT_TYPE } from '@private/features/payview/enums/payview-event-type.enum';
import { PAYVIEW_PAYMENT_EVENT_TYPE } from '@private/features/payview/modules/payment/enums/payview-payment-event-type.enum';
import { PAYVIEW_PROMOTION_EVENT_TYPE } from '@private/features/payview/modules/promotion/enums/payview-promotion-event-type.enum';
import { PAYVIEW_STEPS } from '@private/features/payview/enums/payview-steps.enum';
import { PayviewDeliveryService } from '@private/features/payview/modules/delivery/services/payview-delivery.service';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';
import { PayviewPaymentService } from '@private/features/payview/modules/payment/services/payview-payment.service';
import { PayviewPromotionService } from '@private/features/payview/modules/promotion/services/payview-promotion.service';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';
import { StepperComponent } from '@shared/stepper/stepper.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { PayviewTrackingEventsService } from '../../services/payview-tracking-events/payview-tracking-events.service';
import { take } from 'rxjs/operators';
import {
  getClickAddEditCardEventPropertiesFromPayviewState,
  getClickAddEditAddressEventPropertiesFromPayviewState,
} from '../../services/payview-tracking-events/payview-tracking-events-properties.mapper';

@Component({
  selector: 'tsl-payview-modal',
  templateUrl: './payview-modal.component.html',
  styleUrls: ['./payview-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [PayviewService, PayviewStateManagementService],
})
export class PayviewModalComponent implements OnDestroy, OnInit {
  @ViewChild(StepperComponent) stepper: StepperComponent;

  @Input() public itemHash: string;

  public countries$: Observable<CountryOptionsAndDefault> = this.deliveryCountries.getCountriesAsOptionsAndDefault();
  public readonly DELIVERY_ADDRESS_PREVIOUS_PAGE: DELIVERY_ADDRESS_PREVIOUS_PAGE = DELIVERY_ADDRESS_PREVIOUS_PAGE.DELIVERY;
  private subscriptions: Subscription[] = [];

  constructor(
    private payviewStateManagementService: PayviewStateManagementService,
    private deliveryService: PayviewDeliveryService,
    private activeModal: NgbActiveModal,
    private customerHelpService: CustomerHelpService,
    private deliveryCountries: DeliveryCountriesService,
    private promotionService: PayviewPromotionService,
    private paymentService: PayviewPaymentService,
    private payviewTrackingEventsService: PayviewTrackingEventsService
  ) {}

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  public ngOnInit(): void {
    this.payviewStateManagementService.itemHash = this.itemHash;
    this.subscribe();
  }

  public closeCreditCardEditor(): void {
    this.stepper.goToStep(PAYVIEW_STEPS.PAYVIEW);
    this.payviewStateManagementService.refreshByCreditCard();
  }

  public closeDeliveryEditor(): void {
    this.stepper.goToStep(PAYVIEW_STEPS.PAYVIEW);
    this.payviewStateManagementService.refreshByDelivery();
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public goBack(): void {
    this.goToStep(PAYVIEW_STEPS.PAYVIEW);
  }

  public goToDeliveryAddress(): void {
    this.goToStep(PAYVIEW_STEPS.DELIVERY_ADDRESS);
  }

  public get helpUrl(): string {
    return this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.PAYVIEW);
  }

  public get isSecondaryStep(): boolean {
    return !!this.stepper && this.stepper.activeId !== PAYVIEW_STEPS.PAYVIEW;
  }

  public get payviewState$(): Observable<PayviewState> {
    return this.payviewStateManagementService.payViewState$;
  }

  private goToStep(step: PAYVIEW_STEPS): void {
    this.stepper.goToStep(step);
  }

  private setDeliveryMethod(deliveryMethod: DeliveryBuyerDeliveryMethod): void {
    this.payviewStateManagementService.setDeliveryMethod(deliveryMethod);
  }

  private subscribe(): void {
    this.subscribeToStateManagementEventBus();
    this.subscribeToDeliveryEventBus();
    this.subscribeToPromotionEventBus();
    this.subscribeToPaymentEventBus();
  }

  private subscribeToDeliveryEventBus(): void {
    this.subscriptions.push(
      this.deliveryService.on(PAYVIEW_DELIVERY_EVENT_TYPE.DELIVERY_METHOD_SELECTED, (payload: DeliveryBuyerDeliveryMethod) => {
        this.setDeliveryMethod(payload);
      })
    );
    this.subscriptions.push(
      this.deliveryService.on(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN, () => {
        this.goToStep(PAYVIEW_STEPS.DELIVERY_ADDRESS);
        this.trackClickAddEditAddressEvent(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN);
      })
    );
    this.subscriptions.push(
      this.deliveryService.on(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_PICK_UP_POINT_MAP, () => {
        this.goToStep(PAYVIEW_STEPS.PICK_UP_POINT_MAP);
        this.trackClickAddEditAddressEvent(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_PICK_UP_POINT_MAP);
      })
    );
  }

  private subscribeToPaymentEventBus(): void {
    this.subscriptions.push(
      this.paymentService.on(PAYVIEW_PAYMENT_EVENT_TYPE.PAYMENT_METHOD_SELECTED, (payload: PaymentsPaymentMethod) => {
        this.payviewStateManagementService.setPaymentMethod(payload);
      })
    );
    this.subscriptions.push(
      this.paymentService.on(PAYVIEW_PAYMENT_EVENT_TYPE.OPEN_CREDIT_CARD, () => {
        this.goToStep(PAYVIEW_STEPS.CREDIT_CARD);
        this.trackClickAddEditCardEvent();
      })
    );
  }

  private subscribeToPromotionEventBus(): void {
    this.subscriptions.push(
      this.promotionService.on(PAYVIEW_PROMOTION_EVENT_TYPE.OPEN_PROMOCODE_EDITOR, () => {
        this.goToStep(PAYVIEW_STEPS.PROMOTION_EDITOR);
      })
    );
    this.subscriptions.push(
      this.promotionService.on(PAYVIEW_PROMOTION_EVENT_TYPE.APPLY_PROMOCODE, (value: string) => {
        this.payviewStateManagementService.applyPromocode(value);
      })
    );
    this.subscriptions.push(
      this.promotionService.on(PAYVIEW_PROMOTION_EVENT_TYPE.REMOVE_PROMOCODE, () => {
        this.payviewStateManagementService.removePromocode();
      })
    );
  }

  private subscribeToStateManagementEventBus(): void {
    this.subscriptions.push(
      this.payviewStateManagementService.on(PAYVIEW_EVENT_TYPE.ERROR_ON_REFRESH_COSTS, (error: PayviewError) => {
        this.promotionService.error(error);
      })
    );
    this.subscriptions.push(
      this.payviewStateManagementService.on(PAYVIEW_EVENT_TYPE.SUCCESS_ON_REFRESH_COSTS, () => {
        this.goToStep(PAYVIEW_STEPS.PAYVIEW);
      })
    );
  }

  private unsubscribe(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      if (!!subscription) {
        subscription.unsubscribe();
      }
    });
  }

  private trackClickAddEditCardEvent(): void {
    this.payviewState$
      .pipe(take(1))
      .subscribe((payviewState: PayviewState) =>
        this.payviewTrackingEventsService.trackClickAddEditCard(getClickAddEditCardEventPropertiesFromPayviewState(payviewState))
      );
  }

  private trackClickAddEditAddressEvent(eventType: PAYVIEW_DELIVERY_EVENT_TYPE): void {
    this.payviewState$
      .pipe(take(1))
      .subscribe((payviewState: PayviewState) =>
        this.payviewTrackingEventsService.trackClickAddEditAddress(
          getClickAddEditAddressEventPropertiesFromPayviewState(payviewState, eventType)
        )
      );
  }
}
