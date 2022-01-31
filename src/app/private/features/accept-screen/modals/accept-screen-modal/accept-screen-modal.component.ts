import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DELIVERY_ADDRESS_PREVIOUS_PAGE } from '@private/features/delivery/enums/delivery-address-previous-pages.enum';
import { CountryOptionsAndDefault } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { DeliveryCountriesService } from '@private/features/delivery/services/countries/delivery-countries/delivery-countries.service';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { Observable } from 'rxjs';
import { ACCEPT_SCREEN_ID_STEPS } from '../../constants/accept-screen-id-steps';
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
  public acceptScreenProperties$: Observable<AcceptScreenProperties>;
  public acceptScreenCountries$: Observable<CountryOptionsAndDefault>;
  public headerText: string;
  public isAcceptScreenStep: boolean = true;

  private readonly acceptScreenSlideId: number = ACCEPT_SCREEN_ID_STEPS.ACCEPT_SCREEN;
  private readonly deliveryAddressSlideId: number = ACCEPT_SCREEN_ID_STEPS.DELIVERY_ADDRESS;
  private readonly ACCEPT_SCREEN_HEADER_TRANSLATIONS = ACCEPT_SCREEN_HEADER_TRANSLATIONS;
  private readonly DELIVERY_ADDRESS_PREVIOUS_PAGE = DELIVERY_ADDRESS_PREVIOUS_PAGE.ACCEPT_SCREEN;

  constructor(
    private acceptScreenStoreService: AcceptScreenStoreService,
    private deliveryCountries: DeliveryCountriesService,
    private activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.acceptScreenStoreService.initialize(this.requestId);
    this.acceptScreenProperties$ = this.acceptScreenStoreService.properties$;
    this.acceptScreenCountries$ = this.deliveryCountries.getCountriesAsOptionsAndDefault();
    this.headerText = this.ACCEPT_SCREEN_HEADER_TRANSLATIONS[ACCEPT_SCREEN_ID_STEPS.ACCEPT_SCREEN];
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

  private goSpecificStep(slideId: ACCEPT_SCREEN_ID_STEPS): void {
    this.stepper.goSpecificStep(slideId);
    this.isAcceptScreenStep = slideId === this.acceptScreenSlideId;
    this.headerText = this.ACCEPT_SCREEN_HEADER_TRANSLATIONS[slideId];
    if (this.isAcceptScreenStep) {
      this.acceptScreenStoreService.update(this.requestId);
    }
  }
}
