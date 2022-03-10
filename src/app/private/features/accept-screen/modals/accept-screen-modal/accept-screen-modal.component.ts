import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { COLORS } from '@core/colors/colors-constants';
import { CUSTOMER_HELP_PAGE } from '@core/external-links/customer-help/customer-help-constants';
import { CustomerHelpService } from '@core/external-links/customer-help/customer-help.service';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { DELIVERY_ADDRESS_PREVIOUS_PAGE } from '@private/features/delivery/enums/delivery-address-previous-pages.enum';
import { CountryOptionsAndDefault } from '@private/features/delivery/interfaces/delivery-countries/delivery-countries-api.interface';
import { DeliveryCountriesService } from '@private/features/delivery/services/countries/delivery-countries/delivery-countries.service';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { StepperComponent } from '@shared/stepper/stepper.component';
import { Observable, BehaviorSubject } from 'rxjs';
import { ACCEPT_SCREEN_STEPS } from '../../constants/accept-screen-steps';
import { ACCEPT_SCREEN_HEADER_TRANSLATIONS } from '../../constants/header-translations';
import { AcceptScreenCarrier, AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenStoreService } from '../../services/accept-screen-store/accept-screen-store.service';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { AcceptRequestError } from '@api/core/errors/delivery/accept-screen/accept-request';
import { take } from 'rxjs/operators';

@Component({
  selector: 'tsl-accept-screen-modal',
  templateUrl: './accept-screen-modal.component.html',
  styleUrls: ['./accept-screen-modal.component.scss'],
})
export class AcceptScreenModalComponent implements OnInit {
  @ViewChild(StepperComponent) stepper: StepperComponent;

  public requestId: string;
  public acceptScreenProperties$: Observable<AcceptScreenProperties> = this.acceptScreenStoreService.properties$;
  public acceptScreenCountries$: Observable<CountryOptionsAndDefault> = this.deliveryCountries.getCountriesAsOptionsAndDefault();
  public carrierSelected$: Observable<AcceptScreenCarrier> = this.acceptScreenStoreService.carrierSelected$;
  public carrierSelectedIndex$: Observable<number> = this.acceptScreenStoreService.carrierSelectedIndex$;
  public ACCEPT_SCREEN_HELP_URL: string = this.customerHelpService.getPageUrl(CUSTOMER_HELP_PAGE.ACCEPT_SCREEN);

  public headerText: string;
  public isAcceptScreenStep: boolean = true;
  public readonly DELIVERY_ADDRESS_PREVIOUS_PAGE = DELIVERY_ADDRESS_PREVIOUS_PAGE.DELIVERY;

  private readonly acceptScreenSlideId: number = ACCEPT_SCREEN_STEPS.ACCEPT_SCREEN;
  private readonly deliveryAddressSlideId: number = ACCEPT_SCREEN_STEPS.DELIVERY_ADDRESS;
  private readonly deliveryMapSlideId: number = ACCEPT_SCREEN_STEPS.MAP;
  private readonly ACCEPT_SCREEN_HEADER_TRANSLATIONS = ACCEPT_SCREEN_HEADER_TRANSLATIONS;
  private readonly GENERIC_ERROR_TRANSLATION: string = $localize`:@@accept_view_seller_all_all_snackbar_generic_error:¡Oops! Something has gone wrong. Try again.`;
  private isMapPreviousPage$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private acceptScreenStoreService: AcceptScreenStoreService,
    private deliveryCountries: DeliveryCountriesService,
    private activeModal: NgbActiveModal,
    private customerHelpService: CustomerHelpService,
    private modalService: NgbModal,
    private router: Router,
    private toastService: ToastService,
    private i18nService: I18nService
  ) {}

  ngOnInit() {
    this.acceptScreenStoreService.initialize(this.requestId).then(
      () => {},
      () => {
        this.showError(this.GENERIC_ERROR_TRANSLATION);
        this.closeModal();
      }
    );

    this.refreshStepProperties(ACCEPT_SCREEN_STEPS.ACCEPT_SCREEN);
  }

  public selectNewDropOffMode(carrierIndex: number): void {
    this.acceptScreenStoreService.selectNewDropOffMode(carrierIndex);
  }

  public goToDeliveryAddress(): void {
    this.goToStep(this.deliveryAddressSlideId);
  }

  public goToDeliveryAddressFromMap(): void {
    this.isMapPreviousPage$.next(true);
    this.goToStep(this.deliveryAddressSlideId);
  }

  public goToAcceptScreenOrDeliveryMap(): void {
    if (this.isMapPreviousPage$.value) {
      this.goToDeliveryMap();
    } else {
      this.goToStep(this.acceptScreenSlideId);
    }
    this.acceptScreenStoreService.update(this.requestId);
  }

  public closeModal(): void {
    this.activeModal.close();
  }

  public goToStep(slideId: ACCEPT_SCREEN_STEPS): void {
    this.stepper.goToStep(slideId);
    this.refreshStepProperties(slideId);
  }

  public openRejectRequestModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.properties = {
      title: this.i18nService.translate(TRANSLATION_KEY.ACCEPT_SCREEN_REJECT_REQUEST_MODAL_TITLE),
      description: this.i18nService.translate(TRANSLATION_KEY.ACCEPT_SCREEN_REJECT_REQUEST_MODAL_DESCRIPTION),
      confirmMessage: this.i18nService.translate(TRANSLATION_KEY.ACCEPT_SCREEN_REJECT_REQUEST_MODAL_CONTINUE_BUTTON),
      cancelMessage: this.i18nService.translate(TRANSLATION_KEY.ACCEPT_SCREEN_REJECT_REQUEST_MODAL_BACK_BUTTON),
      confirmColor: COLORS.NEGATIVE_MAIN,
    };

    modalRef.result.then(
      () => {
        this.rejectRequest();
      },
      () => {}
    );
  }

  public checkIfCanAcceptRequest(): void {
    this.acceptScreenProperties$.pipe(take(1)).subscribe((properties: AcceptScreenProperties) => {
      const isCarrierSelected: boolean = !!properties.carriers.find((carrier: AcceptScreenCarrier) => carrier.isSelected);
      if (!isCarrierSelected) {
        this.showNonSelectedCarrierError();
        return;
      }

      if (!properties.seller.fullAddress) {
        this.showMissingFullAddressError();
        return;
      }

      this.acceptRequest();
    });
  }

  private acceptRequest(): void {
    this.acceptScreenStoreService.acceptRequest(this.requestId).subscribe(
      () => this.redirectToTTS(),
      (errors: AcceptRequestError[]) => {
        this.handleError(errors[0]);
      }
    );
  }

  private showMissingFullAddressError(): void {
    const MISSING_SELLER_ADDRESS_ERROR_TRANSLATION: string = $localize`:@@accept_view_seller_all_all_snackbar_pending_sender_details_error:Please enter the sender address.`;
    this.showError(MISSING_SELLER_ADDRESS_ERROR_TRANSLATION);
  }

  private showNonSelectedCarrierError(): void {
    const SELECT_CARRIER_ERROR_TRANSLATION: string = $localize`:@@accept_view_seller_all_all_snackbar_pending_shipping_method_error:Please select how you'll send the package.`;
    this.showError(SELECT_CARRIER_ERROR_TRANSLATION);
  }

  private goToDeliveryMap(): void {
    this.goToStep(this.deliveryMapSlideId);
    this.isMapPreviousPage$.next(false);
  }

  private rejectRequest(): void {
    this.acceptScreenStoreService.rejectRequest(this.requestId).subscribe(
      () => this.redirectToTTS(),
      () => this.showError(this.GENERIC_ERROR_TRANSLATION)
    );
  }

  private showError(text: string): void {
    this.toastService.show({
      text,
      type: TOAST_TYPES.ERROR,
    });
  }

  private refreshStepProperties(slideId: number): void {
    this.headerText = this.ACCEPT_SCREEN_HEADER_TRANSLATIONS[slideId];
    this.isAcceptScreenStep = slideId === this.acceptScreenSlideId;
  }

  private redirectToTTS(): void {
    const pathToTransactionTracking = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${this.requestId}`;
    this.router.navigate([pathToTransactionTracking]);
  }

  private handleError(e: Error | AcceptRequestError): void {
    const errorMessage: string = e?.message ? e.message : this.GENERIC_ERROR_TRANSLATION;

    this.showError(errorMessage);
  }
}
