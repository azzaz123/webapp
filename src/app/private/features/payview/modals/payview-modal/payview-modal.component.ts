import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { CountryOptionsAndDefault } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { DELIVERY_ADDRESS_PREVIOUS_PAGE } from '@private/features/delivery/enums/delivery-address-previous-pages.enum';
import { DeliveryBuyerDeliveryMethod } from '@api/core/model/delivery/buyer/delivery-methods';
import { DeliveryCountriesService } from '@private/features/delivery/services/countries/delivery-countries/delivery-countries.service';
import { PAYVIEW_STEPS } from '@private/features/payview/enums/payview-steps.enum';
import { PAYVIEW_DELIVERY_EVENT_TYPE } from '@private/features/payview/modules/delivery/enums/payview-delivery-event-type.enum';
import { PayviewDeliveryService } from '@private/features/payview/modules/delivery/services/payview-delivery.service';
import { PayviewService } from '@private/features/payview/services/payview/payview.service';
import { PayviewState } from '@private/features/payview/interfaces/payview-state.interface';
import { PayviewStateManagementService } from '@private/features/payview/services/state-management/payview-state-management.service';
import { StepperComponent } from '@shared/stepper/stepper.component';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'tsl-payview-modal',
  templateUrl: './payview-modal.component.html',
  styleUrls: ['./payview-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    private deliveryCountries: DeliveryCountriesService
  ) {}

  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  public ngOnInit(): void {
    this.payviewStateManagementService.itemHash = this.itemHash;
    this.subscribe();
  }

  public closeDeliveryEditor(): void {
    this.stepper.goToStep(PAYVIEW_STEPS.PAYVIEW);
    this.payviewStateManagementService.refreshByDelivery();
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public get helpUrl(): string {
    return this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.PAYVIEW);
  }

  public get payviewState$(): Observable<PayviewState> {
    return this.payviewStateManagementService.payViewState$;
  }

  private goToDeliveryAddress(): void {
    this.stepper.goToStep(PAYVIEW_STEPS.DELIVERY_ADDRESS);
  }

  private goToPickUpPoint(): void {
    // TODO - Uncomment the following line when the pick-up point map is ended
    // this.stepper.goToStep(PayviewSteps.PickUpPointMap);
  }

  private setDeliveryMethod(deliveryMethod: DeliveryBuyerDeliveryMethod): void {
    this.payviewStateManagementService.setDeliveryMethod(deliveryMethod);
  }

  private subscribe(): void {
    this.subscribeToDeliveryMethod();
  }

  private subscribeToDeliveryMethod(): void {
    this.subscriptions.push(
      this.deliveryService.on(PAYVIEW_DELIVERY_EVENT_TYPE.DELIVERY_METHOD_SELECTED, (payload: DeliveryBuyerDeliveryMethod) => {
        this.setDeliveryMethod(payload);
      })
    );
    this.subscriptions.push(
      this.deliveryService.on(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_ADDRESS_SCREEN, () => {
        this.goToDeliveryAddress();
      })
    );
    this.subscriptions.push(
      this.deliveryService.on(PAYVIEW_DELIVERY_EVENT_TYPE.OPEN_PICK_UP_POINT_MAP, () => {
        this.goToPickUpPoint();
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
