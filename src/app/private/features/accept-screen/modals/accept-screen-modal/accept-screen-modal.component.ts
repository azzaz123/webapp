import { Component, OnInit, ViewChild } from '@angular/core';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DELIVERY_ADDRESS_PREVIOUS_PAGE } from '@private/features/delivery/enums/delivery-address-previous-pages.enum';
import { CountryOptionsAndDefault } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { DeliveryCountriesService } from '@private/features/delivery/services/countries/delivery-countries/delivery-countries.service';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { Observable } from 'rxjs';
import { ACCEPT_SCREEN_STEPS } from '../../constants/accept-screen-steps';
import { ACCEPT_SCREEN_HEADER_TRANSLATIONS } from '../../constants/header-translations';
import { AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenStoreService } from '../../services/accept-screen-store/accept-screen-store.service';

@Component({
  selector: 'tsl-accept-screen-modal',
  templateUrl: './accept-screen-modal.component.html',
  styleUrls: ['./accept-screen-modal.component.scss'],
})
export class AcceptScreenModalComponent implements OnInit {
  @ViewChild(StepperComponent, { static: true }) stepper: StepperComponent;

  public requestId: string;
  public acceptScreenProperties$: Observable<AcceptScreenProperties> = this.acceptScreenStoreService.properties$;
  public acceptScreenCountries$: Observable<CountryOptionsAndDefault> = this.deliveryCountries.getCountriesAsOptionsAndDefault();
  public carrierSelectedIndex$: Observable<number> = this.acceptScreenStoreService.carrierSelectedIndex$;

  public headerText: string;
  public isAcceptScreenStep: boolean = true;
  public ACCEPT_SCREEN_HELP_URL: string;
  public readonly DELIVERY_ADDRESS_PREVIOUS_PAGE = DELIVERY_ADDRESS_PREVIOUS_PAGE.ACCEPT_SCREEN;

  private readonly acceptScreenSlideId: number = ACCEPT_SCREEN_STEPS.ACCEPT_SCREEN;
  private readonly deliveryAddressSlideId: number = ACCEPT_SCREEN_STEPS.DELIVERY_ADDRESS;
  private readonly ACCEPT_SCREEN_HEADER_TRANSLATIONS = ACCEPT_SCREEN_HEADER_TRANSLATIONS;

  constructor(
    private acceptScreenStoreService: AcceptScreenStoreService,
    private deliveryCountries: DeliveryCountriesService,
    private activeModal: NgbActiveModal,
    private customerHelpService: CustomerHelpService
  ) {}

  ngOnInit() {
    this.ACCEPT_SCREEN_HELP_URL = this.getHelpURL();
    this.acceptScreenStoreService.initialize(this.requestId);
    this.refreshStepProperties(ACCEPT_SCREEN_STEPS.ACCEPT_SCREEN);
  }

  public selectNewDropOffMode(carrierIndex: number): void {
    this.acceptScreenStoreService.selectNewDropOffMode(carrierIndex);
  }

  public goToDeliveryAddress(): void {
    this.goSpecificStep(this.deliveryAddressSlideId);
  }

  public goToAcceptScreen(): void {
    this.goSpecificStep(this.acceptScreenSlideId);
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  private goSpecificStep(slideId: ACCEPT_SCREEN_STEPS): void {
    this.stepper.goSpecificStep(slideId);
    this.refreshStepProperties(slideId);
    if (this.isAcceptScreenStep) {
      this.acceptScreenStoreService.update(this.requestId);
    }
  }

  private refreshStepProperties(slideId: number): void {
    this.headerText = this.ACCEPT_SCREEN_HEADER_TRANSLATIONS[slideId];
    this.isAcceptScreenStep = slideId === this.acceptScreenSlideId;
  }

  private getHelpURL(): string {
    return this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.ACCEPT_SCREEN);
  }
}
