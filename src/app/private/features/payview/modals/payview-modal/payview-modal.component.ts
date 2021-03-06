import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { CountryOptionsAndDefault } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { DELIVERY_ADDRESS_PREVIOUS_PAGE } from '@private/features/delivery/enums/delivery-address-previous-pages.enum';
import { DeliveryBuyerDeliveryMethod, DeliveryBuyerDeliveryMethods } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCountriesService } from '@private/features/delivery/services/countries/delivery-countries/delivery-countries.service';
import { PaymentsPaymentMethod } from '@api/core/model/payments/interfaces/payments-payment-method.interface';
import { PAYVIEW_BUY_EVENT_TYPE } from '@private/features/payview/modules/buy/enums/payview-buy-event-type.enum';
import { PAYVIEW_DELIVERY_EVENT_TYPE } from '@private/features/payview/modules/delivery/enums/payview-delivery-event-type.enum';
import { PAYVIEW_EVENT_TYPE } from '@private/features/payview/enums/payview-event-type.enum';
import { PAYVIEW_PAYMENT_EVENT_TYPE } from '@private/features/payview/modules/payment/enums/payview-payment-event-type.enum';
import { PAYVIEW_PROMOTION_EVENT_TYPE } from '@private/features/payview/modules/promotion/enums/payview-promotion-event-type.enum';
import { PAYVIEW_STEPS } from '@private/features/payview/enums/payview-steps.enum';
import { PayviewBuyService } from '@private/features/payview/modules/buy/services/payview-buy.service';
import { PayviewDeliveryService } from '@private/features/payview/modules/delivery/services/payview-delivery.service';
import { PayviewError } from '@private/features/payview/interfaces/payview-error.interface';
import { PayviewPaymentService } from '@private/features/payview/modules/payment/services/payview-payment.service';
import { PayviewPromotionService } from '@private/features/payview/modules/promotion/services/payview-promotion.service';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';
import { POST_OFFICE_CARRIER } from '@api/core/model/delivery/post-offices-carriers.type';
import { StepperComponent } from '@shared/stepper/stepper.component';

import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { PayviewTrackingEventsService } from '../../services/payview-tracking-events/payview-tracking-events.service';
import { take } from 'rxjs/operators';
import {
  getClickHelpTransactionalEventPropertiesFromPayviewState,
  getClickAddEditCardEventPropertiesFromPayviewState,
  getClickAddEditAddressEventPropertiesFromPayviewState,
  getViewTransactionPayScreenEventPropertiesFromPayviewState,
  getClickAddPromocodeTransactionPayEventPropertiesFromPayviewState,
  getClickApplyPromocodeTransactionPayEventPropertiesFromPayviewState,
  getPayTransactionEventPropertiesFromPayviewState,
  getTransactionPaymentSuccessPropertiesFromPayviewState,
} from '../../services/payview-tracking-events/payview-tracking-events-properties.mapper';
import { headerTitles } from '../../constants/header-titles';
import { UuidService } from '@core/uuid/uuid.service';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';

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
  @Input() public closeCallback: Function;

  public countries$: Observable<CountryOptionsAndDefault> = this.deliveryCountries.getCountriesAsOptionsAndDefault();
  public headerTitle: string = headerTitles[PAYVIEW_STEPS.PAYVIEW];
  public readonly TRANSACTIONS_PROTECTION_URL: string = this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.TRANSACTIONS_PROTECTION);
  public readonly TERMS_AND_CONDITIONS_URL: string = $localize`:@@web_footer_links_terms_href:https://about.wallapop.com/en/legal-terms-and-conditions`;
  public readonly PRIVACY_POLICY_URL: string = $localize`:@@web_footer_links_privacy_href:https://about.wallapop.com/en/privacy-policy`;
  public readonly DELIVERY_ADDRESS_PREVIOUS_PAGE: DELIVERY_ADDRESS_PREVIOUS_PAGE = DELIVERY_ADDRESS_PREVIOUS_PAGE.DELIVERY;
  public readonly isPayLoadingMessage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private subscriptions: Subscription[] = [];
  private readonly trackViewTransactionPayScreen$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isMapPreviousPage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isPayviewLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly GENERIC_ERROR_TRANSLATION: string = $localize`:@@accept_view_seller_all_all_snackbar_generic_error:??Oops! Something has gone wrong. Try again.`;

  constructor(
    private payviewStateManagementService: PayviewStateManagementService,
    private deliveryService: PayviewDeliveryService,
    private customerHelpService: CustomerHelpService,
    private deliveryCountries: DeliveryCountriesService,
    private promotionService: PayviewPromotionService,
    private paymentService: PayviewPaymentService,
    private payviewTrackingEventsService: PayviewTrackingEventsService,
    private buyService: PayviewBuyService,
    private uuidService: UuidService,
    private toastService: ToastService
  ) {}

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  public ngOnInit(): void {
    this.buyService.enableBuyButton();
    this.payviewStateManagementService.itemHash = this.itemHash;
    this.subscribe();
  }

  public get isPayviewLoading$(): Observable<boolean> {
    return this.isPayviewLoadingSubject.asObservable();
  }

  public closeCreditCardEditor(): void {
    this.goToStep(PAYVIEW_STEPS.PAYVIEW);
    this.payviewStateManagementService.refreshByCreditCard();
  }

  public closeDeliveryEditor(): void {
    if (this.isMapPreviousPage$.value) {
      this.goToStep(PAYVIEW_STEPS.PICK_UP_POINT_MAP);
    } else {
      this.goToStep(PAYVIEW_STEPS.PAYVIEW);
    }
    this.payviewStateManagementService.refreshByDelivery();
  }

  public closeModal(buyRequestId: string = null): void {
    this.closeCallback && this.closeCallback(buyRequestId);
  }

  public getFullAddress(methods: DeliveryBuyerDeliveryMethods): string {
    return methods?.addressLabel;
  }

  public getSelectedCarrier(methods: DeliveryBuyerDeliveryMethods): POST_OFFICE_CARRIER {
    return methods?.current?.carrier ?? POST_OFFICE_CARRIER.CORREOS;
  }

  public getUserOfficeId(methods: DeliveryBuyerDeliveryMethods): string {
    return methods?.current?.lastAddressUsed?.id;
  }

  public goBack(): void {
    if (this.isMapPreviousPage$.value) {
      this.goToStep(PAYVIEW_STEPS.PICK_UP_POINT_MAP);
      this.isMapPreviousPage$.next(false);
    } else {
      this.goToStep(PAYVIEW_STEPS.PAYVIEW);
    }
  }

  public goToDeliveryAddressFromMap(): void {
    this.goToStep(PAYVIEW_STEPS.DELIVERY_ADDRESS);
    this.isMapPreviousPage$.next(true);
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

  public trackCliCkHelpTransactionalEvent(): void {
    this.payviewState$
      .pipe(take(1))
      .subscribe((payviewState: PayviewState) =>
        this.payviewTrackingEventsService.trackClickHelpTransactional(
          getClickHelpTransactionalEventPropertiesFromPayviewState(payviewState)
        )
      );
  }

  public trackPayTransactionEvent(): void {
    this.payviewState$
      .pipe(take(1))
      .subscribe((payviewState: PayviewState) =>
        this.payviewTrackingEventsService.trackPayTransaction(getPayTransactionEventPropertiesFromPayviewState(payviewState))
      );
  }

  private goToStep(step: PAYVIEW_STEPS): void {
    this.headerTitle = headerTitles[step];
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
    this.subscribeToPayviewState();
    this.subscribeToBuyEventBus();
  }

  private subscribeToBuyEventBus(): void {
    this.subscriptions.push(
      this.buyService.on(PAYVIEW_BUY_EVENT_TYPE.BUY, () => {
        this.setPayLoadingMessage(true);
        this.markPayviewAsLoading();
        this.payviewStateManagementService.buyerRequestId = this.uuidService.getUUID();
        this.payviewStateManagementService.buy();
      })
    );
  }

  private subscribeToDeliveryEventBus(): void {
    this.subscriptions.push(
      this.deliveryService.on(PAYVIEW_DELIVERY_EVENT_TYPE.DELIVERY_METHOD_SELECTED, (payload: DeliveryBuyerDeliveryMethod) => {
        this.setDeliveryMethod(payload);
      })
    );
    this.subscriptions.push(
      this.deliveryService.on(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN, () => {
        this.trackClickAddEditAddressEvent(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN);
        this.goToStep(PAYVIEW_STEPS.DELIVERY_ADDRESS);
      })
    );
    this.subscriptions.push(
      this.deliveryService.on(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_PICK_UP_POINT_MAP, () => {
        this.trackClickAddEditAddressEvent(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_PICK_UP_POINT_MAP);
        this.goToStep(PAYVIEW_STEPS.PICK_UP_POINT_MAP);
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
        this.trackClickAddEditCardEvent();
        this.goToStep(PAYVIEW_STEPS.CREDIT_CARD);
      })
    );
  }

  private subscribeToPromotionEventBus(): void {
    this.subscriptions.push(
      this.promotionService.on(PAYVIEW_PROMOTION_EVENT_TYPE.OPEN_PROMOCODE_EDITOR, () => {
        this.trackClickAddPromocodeTransactionPayEvent();
        this.goToStep(PAYVIEW_STEPS.PROMOTION_EDITOR);
      })
    );
    this.subscriptions.push(
      this.promotionService.on(PAYVIEW_PROMOTION_EVENT_TYPE.APPLY_PROMOCODE, (value: string) => {
        this.trackClickApplyPromocodeTransactionPayEvent();
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
      this.payviewStateManagementService.on(PAYVIEW_EVENT_TYPE.SUCCESS_ON_GET_CURRENT_STATE, (error: PayviewError) => {
        this.setPayLoadingMessage(false);
        this.markPayviewAsNotLoading();
      })
    );
    this.subscriptions.push(
      this.payviewStateManagementService.on(PAYVIEW_EVENT_TYPE.ERROR_ON_GET_CURRENT_STATE, () => {
        this.showErrorToast(this.GENERIC_ERROR_TRANSLATION);
        this.closeModal();
      })
    );
    this.subscriptions.push(
      this.payviewStateManagementService.on(PAYVIEW_EVENT_TYPE.ERROR_ON_BUY, (error: PayviewError) => {
        this.setPayLoadingMessage(false);
        this.markPayviewAsNotLoading();
        this.buyService.error(error);
      })
    );
    this.subscriptions.push(
      this.buyService.on(PAYVIEW_BUY_EVENT_TYPE.ERROR, (error: PayviewError) => {
        this.showErrorToast(error.message);
      })
    );
    this.subscriptions.push(
      this.payviewStateManagementService.on(PAYVIEW_EVENT_TYPE.SUCCESS_ON_BUY, () => {
        this.trackTransactionPaymentSuccessEvent();
        this.closeModalOnPaymentSuccess();
      })
    );
    this.subscriptions.push(
      this.payviewStateManagementService.on(PAYVIEW_EVENT_TYPE.SUCCESS_ON_CANCEL_REQUEST, () => {
        this.buyService.enableBuyButton();
        this.setPayLoadingMessage(false);
        this.markPayviewAsNotLoading();
      })
    );
    this.subscriptions.push(
      this.payviewStateManagementService.on(PAYVIEW_EVENT_TYPE.ERROR_ON_REFRESH_COSTS, (error: PayviewError) => {
        this.promotionService.error(error);
      })
    );
    this.subscriptions.push(
      this.payviewStateManagementService.on(PAYVIEW_EVENT_TYPE.SUCCESS_ON_REFRESH_COSTS, () => {
        if (this.isMapPreviousPage$.value) {
          this.isMapPreviousPage$.next(false);
        } else {
          this.goToStep(PAYVIEW_STEPS.PAYVIEW);
        }
      })
    );
  }

  private subscribeToPayviewState(): void {
    this.subscriptions.push(
      this.payviewState$.subscribe((payviewState: PayviewState) => {
        if (payviewState && !this.trackViewTransactionPayScreen$.value) {
          this.trackViewTransactionPayScreenEvent(payviewState);
        }
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

  private closeModalOnPaymentSuccess(): void {
    this.payviewState$.pipe(take(1)).subscribe((payviewState: PayviewState) => this.closeModal(payviewState.buyerRequestId));
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

  private trackViewTransactionPayScreenEvent(payviewState: PayviewState): void {
    this.payviewTrackingEventsService.trackViewTransactionPayScreen(
      getViewTransactionPayScreenEventPropertiesFromPayviewState(payviewState)
    );
    this.trackViewTransactionPayScreen$.next(true);
  }

  private trackClickAddPromocodeTransactionPayEvent(): void {
    this.payviewState$
      .pipe(take(1))
      .subscribe((payviewState: PayviewState) =>
        this.payviewTrackingEventsService.trackClickAddPromocodeTransactionPay(
          getClickAddPromocodeTransactionPayEventPropertiesFromPayviewState(payviewState)
        )
      );
  }

  private trackClickApplyPromocodeTransactionPayEvent(): void {
    this.payviewState$
      .pipe(take(1))
      .subscribe((payviewState: PayviewState) =>
        this.payviewTrackingEventsService.trackClickApplyPromocodeTransactionPay(
          getClickApplyPromocodeTransactionPayEventPropertiesFromPayviewState(payviewState)
        )
      );
  }

  private trackTransactionPaymentSuccessEvent(): void {
    this.payviewState$
      .pipe(take(1))
      .subscribe((payviewState: PayviewState) =>
        this.payviewTrackingEventsService.trackTransactionPaymentSuccess(
          getTransactionPaymentSuccessPropertiesFromPayviewState(payviewState)
        )
      );
  }

  private markPayviewAsLoading(): void {
    this.isPayviewLoadingSubject.next(true);
  }

  private markPayviewAsNotLoading(): void {
    this.isPayviewLoadingSubject.next(false);
  }

  private setPayLoadingMessage(isMessage: boolean): void {
    isMessage ? this.isPayLoadingMessage$.next(true) : this.isPayLoadingMessage$.next(false);
  }

  private showErrorToast(text: string): void {
    this.toastService.show({
      text,
      type: TOAST_TYPES.ERROR,
    });
  }
}
