import { DeliveryCountriesService } from '../../services/countries/delivery-countries/delivery-countries.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeliveryAddressApi } from '../../interfaces/delivery-address/delivery-address-api.interface';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DeliveryLocationsService } from '../../services/locations/delivery-locations/delivery-locations.service';
import { DeliveryAddressService } from '../../services/address/delivery-address/delivery-address.service';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { DeliveryLocationApi } from '../../interfaces/delivery-location/delivery-location-api.interface';
import { DropdownComponent } from '@shared/dropdown/dropdown.component';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { DELIVERY_PATHS } from './../../delivery-routing-constants';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { Observable, Subscription } from 'rxjs';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { UuidService } from '@core/uuid/uuid.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { finalize, map, tap } from 'rxjs/operators';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { Router } from '@angular/router';
import { CountryOptionsAndDefault } from '../../interfaces/delivery-countries/delivery-countries-api.interface';

import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { COLORS } from '@core/colors/colors-constants';
import { DeliveryPostalCodesErrorTranslations } from '@private/features/delivery/errors/constants/delivery-error-translations';
import {
  DeliveryAddressError,
  PhoneNumberIsInvalidError,
  MobilePhoneNumberIsInvalidError,
  AddressTooLongError,
  FlatAndFloorTooLongError,
  UniqueAddressByUserError,
} from '../../errors/classes/address';
import {
  DeliveryPostalCodesError,
  PostalCodeDoesNotExistError,
  PostalCodeIsInvalidError,
  PostalCodeIsNotAllowedError,
} from '../../errors/classes/postal-codes';
import { DELIVERY_INPUTS_MAX_LENGTH } from '../../enums/delivery-inputs-length.enum';
import { DeliveryAddressTrackEventsService } from '../../services/address/delivery-address-track-events/delivery-address-track-events.service';
import { DeliveryAddressFormErrorMessages } from '../../interfaces/delivery-address/delivery-address-form-error-messages.interface';
import { DELIVERY_ADDRESS_PREVIOUS_PAGE } from '../../enums/delivery-address-previous-pages.enum';
import { ConfirmationModalKeyProperties } from '@shared/confirmation-modal/confirmation-modal.interface';

@Component({
  selector: 'tsl-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss'],
})
export class DeliveryAddressComponent implements OnInit {
  @Input() whereUserComes: DELIVERY_ADDRESS_PREVIOUS_PAGE;
  @ViewChild(ProfileFormComponent, { static: true }) formComponent: ProfileFormComponent;
  @ViewChild('country_iso_code') countriesDropdown: DropdownComponent;

  public readonly DELIVERY_INPUTS_MAX_LENGTH = DELIVERY_INPUTS_MAX_LENGTH;
  public countries: IOption[] = [];
  public cities: IOption[] = [];
  public deliveryAddressForm: FormGroup;
  public loading = true;
  public isNewForm = true;
  public loadingButton = false;
  public isCountryEditable = false;
  public locations: DeliveryLocationApi[] = [];
  public readonly PREVIOUS_PAGE = DELIVERY_ADDRESS_PREVIOUS_PAGE;
  public formErrorMessages: DeliveryAddressFormErrorMessages = {
    phone_number: '',
    postal_code: '',
    street: '',
    flat_and_floor: '',
  };
  public comesFromPayView: boolean;
  private subscriptions: Subscription = new Subscription();
  private readonly formSubmittedEventKey = 'formSubmitted';

  constructor(
    private fb: FormBuilder,
    private deliveryAddressService: DeliveryAddressService,
    private deliveryCountriesService: DeliveryCountriesService,
    private eventService: EventService,
    private toastService: ToastService,
    private uuidService: UuidService,
    private modalService: NgbModal,
    private deliveryLocationsService: DeliveryLocationsService,
    private router: Router,
    private i18nService: I18nService,
    private deliveryAddressTrackEventsService: DeliveryAddressTrackEventsService
  ) {}

  ngOnInit() {
    this.comesFromPayView =
      this.whereUserComes === DELIVERY_ADDRESS_PREVIOUS_PAGE.PAYVIEW_ADD_ADDRESS ||
      this.whereUserComes === DELIVERY_ADDRESS_PREVIOUS_PAGE.PAYVIEW_PAY;
    this.buildForm();
    this.eventService.subscribe(this.formSubmittedEventKey, () => {
      this.onSubmit();
    });
    this.clearFormAndResetLocationsWhenCountryChange();
    this.requestLocationsWhenPostalCodeChange();
    this.updateRegionWhenCityChange();
  }

  ngOnDestroy() {
    this.eventService.unsubscribeAll(this.formSubmittedEventKey);
    this.subscriptions.unsubscribe();
  }

  public initForm(cache: boolean = true): void {
    this.deliveryAddressService
      .get(cache)
      .subscribe(
        (deliveryAddress: DeliveryAddressApi) => {
          if (deliveryAddress) {
            this.handleExistingForm(deliveryAddress);
          } else {
            this.handleNewForm();
          }
        },
        () => {
          this.handleNewForm();
        }
      )
      .add(() => {
        this.deliveryAddressForm.updateValueAndValidity();
      });
  }

  public onSubmit(): void {
    this.deliveryAddressTrackEventsService.trackClickSaveButton();

    if (this.deliveryAddressForm.valid) {
      this.submitValidForm();
    } else {
      this.deliveryAddressForm.markAsPending();
      this.showToast(TRANSLATION_KEY.DELIVERY_ADDRESS_MISSING_INFO_ERROR, 'error');
      for (const control in this.deliveryAddressForm.controls) {
        if (this.deliveryAddressForm.controls.hasOwnProperty(control) && !this.deliveryAddressForm.controls[control].valid) {
          this.deliveryAddressForm.controls[control].markAsDirty();
        }
      }
    }
  }

  public handleShowWarningCountry(): void {
    if (!this.isCountryEditable && this.countries?.length > 1) {
      if (this.isNewForm) {
        this.isCountryEditable = true;
      } else {
        this.generateConfirmationModalRef({
          description: TRANSLATION_KEY.DELIVERY_ADDRESS_COUNTRY_CHANGE_CONFIRMATION_MESSAGE,
          confirmMessage: TRANSLATION_KEY.DELIVERY_ADDRESS_COUNTRY_SELECTION_CONTINUE_BUTTON,
          cancelMessage: TRANSLATION_KEY.DELIVERY_ADDRESS_COUNTRY_SELECTION_CANCEL_BUTTON,
        }).result.then(() => {
          this.isCountryEditable = true;
          setTimeout(() => {
            this.countriesDropdown.open();
          });
        });
      }
    }
  }

  public isInvalidPostalCode(): void {
    const postalCode = this.deliveryAddressForm.get('postal_code');
    if (postalCode.value.length < 5 && !postalCode.errors?.required) {
      this.setIncorrectControlAndShowError('postal_code', DeliveryPostalCodesErrorTranslations.INVALID_POSTAL_CODE);
    }
  }

  public deleteForm(): void {
    this.generateConfirmationModalRef({
      description: TRANSLATION_KEY.DELIVERY_ADDRESS_DELETE_REQUEST,
      confirmMessage: TRANSLATION_KEY.DELETE_BUTTON,
    }).result.then(() => {
      this.deliveryAddressService.delete(this.deliveryAddressForm.get('id').value).subscribe(
        () => {
          this.showToast(TRANSLATION_KEY.DELIVERY_ADDRESS_DELETE_SUCCESS, 'success');
          this.clearForm(true);
          this.prepareFormAndInitializeCountries(true);
        },
        () => {
          this.showToast(TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_ERROR, 'error');
        }
      );
    });
  }

  private clearFormAndResetLocationsWhenCountryChange(): void {
    const countryISOCode = this.deliveryAddressForm.get('country_iso_code');

    const subscription = countryISOCode.valueChanges.subscribe(() => {
      if (countryISOCode.dirty) {
        this.resetCitiesAndLocations();
        this.clearForm(false);
      }
    });

    this.subscriptions.add(subscription);
  }

  private clearForm(isNewForm: boolean): void {
    const id = isNewForm ? this.uuidService.getUUID() : this.deliveryAddressForm.get('id').value;
    const country_iso_code = this.deliveryAddressForm.get('country_iso_code').value;

    this.deliveryAddressForm.clearValidators();
    this.deliveryAddressForm.reset({
      id,
      country_iso_code,
    });
  }

  private requestLocationsWhenPostalCodeChange(): void {
    const subscription = this.deliveryAddressForm.get('postal_code').valueChanges.subscribe((newPostalCode: string) => {
      const countryISOCode = this.deliveryAddressForm.get('country_iso_code');
      const postalCode = this.deliveryAddressForm.get('postal_code');

      if (postalCode.dirty) {
        this.resetCitiesAndLocations();
        this.deliveryAddressForm.get('city').reset();
        this.deliveryAddressForm.get('region').reset();
        if (postalCode.valid && newPostalCode?.length === 5) {
          this.getLocationsAndHandlePostalCode(newPostalCode, countryISOCode.value);
        }
      }
    });

    this.subscriptions.add(subscription);
  }

  private updateRegionWhenCityChange(): void {
    const subscription = this.deliveryAddressForm.get('city').valueChanges.subscribe((newCity: string) => {
      if (this.deliveryAddressForm.get('postal_code').valid && this.locations.length > 1) {
        const selectedLocation = this.locations.find((location: DeliveryLocationApi) => location.city === newCity);
        this.deliveryAddressForm.get('region').setValue(selectedLocation.region);
      }
    });

    this.subscriptions.add(subscription);
  }

  private handleExistingForm(deliveryAddress: DeliveryAddressApi): void {
    this.initializeCitiesAsOptions(deliveryAddress.postal_code, deliveryAddress.country_iso_code)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe();

    this.patchCurrentForm(deliveryAddress);
    this.prepareFormAndInitializeCountries(false);
  }

  private handleNewForm(): void {
    this.loading = false;
    this.prepareFormAndInitializeCountries(true);
  }

  private prepareFormAndInitializeCountries(isNewForm: boolean): void {
    this.isNewForm = isNewForm;
    this.formComponent.initFormControl();
    this.initializeCountries(isNewForm);
    this.patchFormValues();
  }

  private submitValidForm(): void {
    this.loadingButton = true;
    this.isCountryEditable = false;

    const subscription = this.isNewForm
      ? this.deliveryAddressService.create(this.deliveryAddressForm.getRawValue())
      : this.deliveryAddressService.update(this.deliveryAddressForm.getRawValue());

    subscription
      .pipe(
        finalize(() => {
          this.loadingButton = false;
        })
      )
      .subscribe(
        () => {
          const successKey = this.isNewForm
            ? TRANSLATION_KEY.DELIVERY_ADDRESS_CREATE_SUCCESS
            : TRANSLATION_KEY.DELIVERY_ADDRESS_EDIT_SUCCESS;

          this.isNewForm = false;
          this.showToast(successKey, 'success');
          this.redirect();
        },
        (errors: DeliveryAddressError[]) => this.handleAddressErrors(errors)
      );
  }

  private handleAddressErrors(errors: DeliveryAddressError[]): void {
    let hasUniqueAddressError = false;

    if (errors.length > 1) {
      this.handleMultiplePostalCodeErrors(errors);
    }

    errors.forEach((error: DeliveryAddressError) => {
      if (error instanceof PhoneNumberIsInvalidError) {
        this.setIncorrectControlAndShowError('phone_number', error.message);
      }

      if (error instanceof MobilePhoneNumberIsInvalidError) {
        this.setIncorrectControlAndShowError('phone_number', error.message);
      }

      if (error instanceof AddressTooLongError) {
        this.setIncorrectControlAndShowError('street', error.message);
      }

      if (error instanceof FlatAndFloorTooLongError) {
        this.setIncorrectControlAndShowError('flat_and_floor', error.message);
      }

      if (error instanceof PostalCodeIsNotAllowedError) {
        this.setIncorrectControlAndShowError(
          'postal_code',
          this.i18nService.translate(TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_NOT_ALLOWED_ERROR_AFTER_SAVE)
        );
      }

      if (error instanceof UniqueAddressByUserError) {
        hasUniqueAddressError = true;
      } else {
        this.deliveryAddressForm.markAsPending();
      }
    });

    const key: TRANSLATION_KEY =
      !errors.length || hasUniqueAddressError
        ? TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_ERROR
        : TRANSLATION_KEY.DELIVERY_ADDRESS_MISSING_INFO_ERROR;

    this.showToast(key, 'error');
  }

  private handleMultiplePostalCodeErrors(errors: DeliveryAddressError[]): void {
    const postalCodeIsInvalid = errors.find((error) => error instanceof PostalCodeIsInvalidError);
    const postalCodeNotExist = errors.find((error) => error instanceof PostalCodeDoesNotExistError);
    if (postalCodeIsInvalid && postalCodeNotExist) {
      this.setIncorrectControlAndShowError(
        'postal_code',
        this.i18nService.translate(TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_INVALID_AFTER_SAVE_ERROR)
      );

      this.deliveryAddressForm.markAsPending();
      return;
    }
  }

  private handlePostalCodesErrors(errors: DeliveryPostalCodesError[]): void {
    errors.find((error) => error instanceof PostalCodeIsNotAllowedError).message = this.i18nService.translate(
      TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_NOT_ALLOWED_ERROR_BEFORE_SAVE
    );
    errors.forEach((error) => this.setIncorrectControlAndShowError('postal_code', error.message));
  }

  private redirect(): void {
    switch (this.whereUserComes) {
      case DELIVERY_ADDRESS_PREVIOUS_PAGE.PAYVIEW_ADD_ADDRESS:
        this.router.navigate([DELIVERY_PATHS.PAYVIEW]);
        break;
      case DELIVERY_ADDRESS_PREVIOUS_PAGE.PAYVIEW_PAY:
        this.router.navigate([DELIVERY_PATHS.SHIPMENT_TRACKING]);
        break;
    }
  }

  private getLocationsAndHandlePostalCode(postalCode: string, countryISOCode: string): void {
    this.deliveryLocationsService
      .getLocationsByPostalCodeAndCountry(postalCode, countryISOCode)
      .pipe(
        tap((locations: DeliveryLocationApi[]) => {
          this.locations = locations;
        }),
        map((locations: DeliveryLocationApi[]) => this.mapCitiesAsOptions(locations))
      )
      .subscribe(
        (cities: IOption[]) => {
          this.cities = cities;
          this.handleLocationsResponse(this.locations);
        },
        (errors: DeliveryPostalCodesError[]) => this.handlePostalCodesErrors(errors)
      );
  }

  private handleLocationsResponse(locations: DeliveryLocationApi[]): void {
    if (!locations.length) {
      this.setIncorrectControlAndShowError(
        'postal_code',
        this.i18nService.translate(TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_NOT_EXISTS_ERROR)
      );
    }
    if (locations.length === 1 && !this.deliveryAddressForm.get('city').value) {
      this.deliveryAddressForm.get('city').setValue(locations[0].city);
      this.deliveryAddressForm.get('region').setValue(locations[0].region);
    }
  }

  private setIncorrectControlAndShowError(formControl: string, message: string): void {
    this.deliveryAddressForm.get(formControl).setErrors(null);
    this.deliveryAddressForm.get(formControl).setErrors({ invalid: true });
    this.deliveryAddressForm.get(formControl).markAsDirty();
    this.formErrorMessages[formControl] = message;
  }

  private patchFormValues(): void {
    for (const control in this.deliveryAddressForm.controls) {
      if (this.deliveryAddressForm.controls.hasOwnProperty(control)) {
        this.deliveryAddressForm.controls[control].markAsPristine();
      }
    }
  }

  private initializeCountries(isNewForm = true): void {
    this.deliveryCountriesService.getCountriesAsOptionsAndDefault().subscribe((countryOptionsAndDefault: CountryOptionsAndDefault) => {
      this.countries = countryOptionsAndDefault.countryOptions;
      if (isNewForm) {
        this.deliveryAddressForm.get('country_iso_code').setValue(countryOptionsAndDefault.defaultCountry.iso_code);
      }
    });
  }

  private initializeCitiesAsOptions(postalCode: string, countryISOCode: string): Observable<DeliveryLocationApi[]> {
    return this.deliveryLocationsService.getLocationsByPostalCodeAndCountry(postalCode, countryISOCode).pipe(
      tap((locations: DeliveryLocationApi[]) => {
        this.cities = this.mapCitiesAsOptions(locations);
      })
    );
  }

  private mapCitiesAsOptions(locations: DeliveryLocationApi[]): IOption[] {
    return locations.map((location: DeliveryLocationApi) => {
      return { label: location.city, value: location.city };
    });
  }

  private patchCurrentForm(deliveryAddress: DeliveryAddressApi): void {
    this.deliveryAddressForm.patchValue({
      id: deliveryAddress.id,
      country_iso_code: deliveryAddress.country_iso_code,
      region: deliveryAddress.region,
      full_name: deliveryAddress.full_name,
      street: deliveryAddress.street,
      flat_and_floor: deliveryAddress.flat_and_floor,
      postal_code: deliveryAddress.postal_code,
      city: deliveryAddress.city,
      phone_number: deliveryAddress.phone_number,
    });
  }

  private resetCitiesAndLocations(): void {
    this.cities = [];
    this.locations = [];
  }

  private buildForm(): void {
    this.deliveryAddressForm = this.fb.group({
      id: this.uuidService.getUUID(),
      country_iso_code: ['', [Validators.required]],
      region: ['', [Validators.required]],
      full_name: ['', [Validators.required]],
      street: ['', [Validators.required]],
      flat_and_floor: [''],
      postal_code: ['', [Validators.required]],
      city: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
    });
  }

  private showToast(key: TRANSLATION_KEY, type: 'error' | 'success'): void {
    this.toastService.show({
      text: this.i18nService.translate(key),
      type,
    });
  }

  private generateConfirmationModalRef(keyProperties: ConfirmationModalKeyProperties): NgbModalRef {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.properties = {
      description: this.i18nService.translate(keyProperties.description),
      confirmMessage: this.i18nService.translate(keyProperties.confirmMessage),
      cancelMessage: keyProperties.cancelMessage ? this.i18nService.translate(keyProperties.cancelMessage) : null,
      confirmColor: COLORS.NEGATIVE_MAIN,
    };

    return modalRef;
  }
}
