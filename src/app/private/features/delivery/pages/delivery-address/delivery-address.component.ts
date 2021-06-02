import {
  DeliveryAddressErrorSpecification,
  DeliveryAddressErrorsSpecifications,
  DeliveryAddressFormErrorMessages,
  DELIVERY_ADDRESS_ERROR,
} from '@private/features/delivery/interfaces/delivery-address/delivery-address-error.interface';
import { DeliveryCountriesService } from '../../services/countries/delivery-countries/delivery-countries.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeCountryConfirmationModalComponent } from '../../modals/change-country-confirmation-modal/change-country-confirmation-modal.component';
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
import { DeliveryAddressError, INVALID_DELIVERY_ADDRESS_CODE } from '../../errors/delivery-address/delivery-address-error';
import { CountryOptionsAndDefault } from '../../interfaces/delivery-countries/delivery-countries-api.interface';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { COLORS } from '@core/colors/colors-constants';
import { DELIVERY_INPUTS_MAX_LENGTH } from '../../enums/delivery-inputs-length.enum';
import { DeliveryAddressTrackEventsService } from '../../services/address/delivery-address-track-events/delivery-address-track-events.service';

export enum PREVIOUS_PAGE {
  PAYVIEW_ADD_ADDRESS,
  PAYVIEW_PAY,
}

@Component({
  selector: 'tsl-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss'],
})
export class DeliveryAddressComponent implements OnInit {
  @Input() whereUserComes: PREVIOUS_PAGE;
  @ViewChild(ProfileFormComponent, { static: true }) formComponent: ProfileFormComponent;
  @ViewChild('country_iso_code') countriesDropdown: DropdownComponent;

  public readonly DELIVERY_INPUTS_MAX_LENGTH = DELIVERY_INPUTS_MAX_LENGTH;
  public countries: IOption[] = [];
  public cities: IOption[] = [];
  public deliveryAddressForm: FormGroup;
  public loading = true;
  public isNewForm = true;
  public isCountryEditable = false;
  public locations: DeliveryLocationApi[] = [];
  public readonly PREVIOUS_PAGE = PREVIOUS_PAGE;
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
    this.comesFromPayView = this.whereUserComes === PREVIOUS_PAGE.PAYVIEW_ADD_ADDRESS || this.whereUserComes === PREVIOUS_PAGE.PAYVIEW_PAY;
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
      this.showToast(TRANSLATION_KEY.FORM_FIELD_ERROR, 'error');
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
        this.modalService.open(ChangeCountryConfirmationModalComponent).result.then((result: boolean) => {
          if (result) {
            this.isCountryEditable = true;
            setTimeout(() => {
              this.countriesDropdown.open();
            });
          }
        });
      }
    }
  }

  public isInvalidPostalCode(): void {
    const postalCode = this.deliveryAddressForm.get('postal_code');
    if (postalCode.value.length < 5 && !postalCode.errors?.required) {
      this.setIncorrectControlAndShowError('postal_code', TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_INVALID_ERROR);
    }
  }

  public deleteForm(): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.properties = {
      description: this.i18nService.translate(TRANSLATION_KEY.DELIVERY_ADDRESS_DELETE_REQUEST),
      confirmMessage: this.i18nService.translate(TRANSLATION_KEY.DELETE_BUTTON),
      confirmColor: COLORS.NEGATIVE_MAIN,
    };

    modalRef.result.then(() => {
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
    this.loading = true;
    this.isCountryEditable = false;

    this.deliveryAddressService
      .updateOrCreate(this.deliveryAddressForm.getRawValue(), this.isNewForm)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        () => {
          this.isNewForm = false;
          this.showToast(TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_SUCCESS, 'success');
          this.redirect();
        },
        (errors: DeliveryAddressError[]) => {
          if (errors[0].status === INVALID_DELIVERY_ADDRESS_CODE) {
            this.showToast(TRANSLATION_KEY.FORM_FIELD_ERROR, 'error');
            this.onError(errors, true);
          } else {
            this.showToast(TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_ERROR, 'error');
          }
        }
      );
  }

  private onError(errors: DeliveryAddressError[], isSave = false): void {
    errors.forEach((deliveryAddressError: DeliveryAddressError) => {
      const generatedError = DeliveryAddressErrorsSpecifications.find(
        (errorSpecification: DeliveryAddressErrorSpecification) =>
          errorSpecification.error_code === DELIVERY_ADDRESS_ERROR[deliveryAddressError.error_code]
      );

      this.setIncorrectControlAndShowError(generatedError.formControlName, generatedError.translationKey);
    });

    if (isSave) {
      this.deliveryAddressForm.markAsPending();
    }
  }

  private redirect(): void {
    switch (this.whereUserComes) {
      case PREVIOUS_PAGE.PAYVIEW_ADD_ADDRESS:
        this.router.navigate([DELIVERY_PATHS.PAYVIEW]);
        break;
      case PREVIOUS_PAGE.PAYVIEW_PAY:
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
        (errors: DeliveryAddressError[]) => {
          this.onError(errors);
        }
      );
  }

  private handleLocationsResponse(locations: DeliveryLocationApi[]): void {
    if (!locations.length) {
      this.setIncorrectControlAndShowError('postal_code', TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_MISSMATCH_LOCATION_ERROR);
    }
    if (locations.length === 1 && !this.deliveryAddressForm.get('city').value) {
      this.deliveryAddressForm.get('city').setValue(locations[0].city);
      this.deliveryAddressForm.get('region').setValue(locations[0].region);
    }
  }

  private setIncorrectControlAndShowError(formControl: string, translationKey: TRANSLATION_KEY): void {
    this.deliveryAddressForm.get(formControl).setErrors(null);
    this.deliveryAddressForm.get(formControl).setErrors({ invalid: true });
    this.deliveryAddressForm.get(formControl).markAsDirty();
    this.formErrorMessages[formControl] = this.i18nService.translate(translationKey);
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
      text: `${this.i18nService.translate(key)}`,
      type,
    });
  }
}
