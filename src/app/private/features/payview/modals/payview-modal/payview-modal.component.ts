import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { CountryOptionsAndDefault } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { DELIVERY_ADDRESS_PREVIOUS_PAGE } from '@private/features/delivery/enums/delivery-address-previous-pages.enum';
import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCountriesService } from '@private/features/delivery/services/countries/delivery-countries/delivery-countries.service';
import { PayviewDeliveryEventType } from '@private/features/payview/modules/delivery/enums/payview-delivery-event-type.interface';
import { PayviewDeliveryService } from '@private/features/payview/modules/delivery/services/payview-delivery.service';
import { PayviewPromotionEventType } from '@private/features/payview/modules/promotion/enums/payview-promotion-event-type.interface';
import { PayviewPromotionService } from '@private/features/payview/modules/promotion/services/payview-promotion.service';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';
import { PayviewSteps } from '@private/features/payview/enums/payview-steps.enum';
import { StepperComponent } from '@shared/stepper/stepper.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';

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
  public readonly DELIVERY_ADDRESS_PREVIOUS_PAGE: DELIVERY_ADDRESS_PREVIOUS_PAGE = DELIVERY_ADDRESS_PREVIOUS_PAGE.ACCEPT_SCREEN;
  private subscriptions: Subscription[] = [];

  constructor(
    private payviewStateManagementService: PayviewStateManagementService,
    private deliveryService: PayviewDeliveryService,
    private activeModal: NgbActiveModal,
    private customerHelpService: CustomerHelpService,
    private deliveryCountries: DeliveryCountriesService,
    private promotionService: PayviewPromotionService
  ) {}

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  public ngOnInit(): void {
    this.payviewStateManagementService.itemHash = this.itemHash;
    this.subscribe();
  }

  public closeDeliveryEditor(): void {
    this.stepper.goToStep(PayviewSteps.Payview);
    this.payviewStateManagementService.refreshByDelivery();
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public goBack(): void {
    this.goToStep(PayviewSteps.Payview);
  }

  private goToStep(step: PayviewSteps): void {
    this.stepper.goToStep(step);
  }

  public get helpUrl(): string {
    return this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.PAYVIEW);
  }

  public get isSecondaryStep(): boolean {
    return !!this.stepper && this.stepper.activeId !== PayviewSteps.Payview;
  }

  public get payviewState$(): Observable<PayviewState> {
    return this.payviewStateManagementService.payViewState$;
  }

  private setDeliveryMethod(deliveryMethod: DeliveryBuyerDeliveryMethod): void {
    this.payviewStateManagementService.setDeliveryMethod(deliveryMethod);
  }

  private subscribe(): void {
    this.subscribeToDeliveryEventBus();
    this.subscribeToPromotionEventBus();
  }

  private subscribeToDeliveryEventBus(): void {
    this.subscriptions.push(
      this.deliveryService.on(PayviewDeliveryEventType.DeliveryMethodSelected, (payload: DeliveryBuyerDeliveryMethod) => {
        this.setDeliveryMethod(payload);
      })
    );
    this.subscriptions.push(
      this.deliveryService.on(PayviewDeliveryEventType.OpenAddressScreen, () => {
        this.goToStep(PayviewSteps.DeliveryAddress);
      })
    );
    this.subscriptions.push(
      this.deliveryService.on(PayviewDeliveryEventType.OpenPickUpPointMap, () => {
        this.goToStep(PayviewSteps.PickUpPointMap);
      })
    );
  }

  private subscribeToPromotionEventBus(): void {
    this.subscriptions.push(
      this.promotionService.on(PayviewPromotionEventType.OpenPromocodeEditor, () => {
        this.goToStep(PayviewSteps.PromotionEditor);
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
}
