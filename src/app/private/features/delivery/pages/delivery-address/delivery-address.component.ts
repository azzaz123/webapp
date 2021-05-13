import { CountryOptionsAndDefault, DeliveryCountriesService } from '../../services/countries/delivery-countries/delivery-countries.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeCountryConfirmationModalComponent } from '../../modals/change-country-confirmation-modal/change-country-confirmation-modal.component';
import { DeliveryAddressApi, DeliveryAddressError } from '../../interfaces/delivery-address/delivery-address-api.interface';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MappedAddressError, ADDRESS_ERROR_TYPE } from '../../interfaces/delivery-address/delivery-address-error.interface';
import { DeliveryLocationsStoreService } from '../../services/locations/delivery-locations-store/delivery-locations-store.service';
import { DeliveryAddressStoreService } from '../../services/address/delivery-address-store/delivery-address-store.service';
import { DeliveryAddressErrorService } from '../../services/address/delivery-address-error/delivery-address-error.service';
import { DeliveryLocationsService } from '../../services/locations/delivery-locations/delivery-locations.service';
import { DeliveryAddressService } from '../../services/address/delivery-address/delivery-address.service';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { whitespaceValidator } from '@core/form-validators/formValidators.func';
import { postalCodeValidator } from '@core/form-validators/postalCodeValidator.func';
import { DeliveryLocationApi } from '../../interfaces/delivery-location/delivery-location-api.interface';
import { DropdownComponent } from '@shared/dropdown/dropdown.component';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { DELIVERY_PATHS } from './../../delivery-routing-constants';
import { ErrorsService } from '@core/errors/errors.service';
import { Observable, Subscription } from 'rxjs';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { UuidService } from '@core/uuid/uuid.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, tap } from 'rxjs/operators';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

export enum PREVIOUS_PAGE {
  PAYVIEW_ADD_ADDRESS,
  ADDRESS_VIEW,
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

  public countries: IOption[] = [];
  public cities: IOption[] = [];
  public deliveryAddressForm: FormGroup;
  public loading = true;
  public isNewForm = true;
  public isCountryEditable = false;
  public postalCodeErrorMessage: string;
  public phoneNumberErrorMessage: string;
  public readonly PREVIOUS_PAGE = PREVIOUS_PAGE;
  private subscriptions: Subscription = new Subscription();
  private readonly formSubmittedEventKey = 'formSubmitted';

  constructor(
    private fb: FormBuilder,
    private deliveryAddressService: DeliveryAddressService,
    private deliveryCountriesService: DeliveryCountriesService,
    private deliveryAddressStoreService: DeliveryAddressStoreService,
    private eventService: EventService,
    private errorsService: ErrorsService,
    private uuidService: UuidService,
    private modalService: NgbModal,
    private deliveryLocationsService: DeliveryLocationsService,
    private deliveryLocationsStoreService: DeliveryLocationsStoreService,
    private router: Router,
    private deliveryAddressErrorService: DeliveryAddressErrorService,
    private i18nService: I18nService
  ) {
    this.buildForm();
    this.eventService.subscribe(this.formSubmittedEventKey, () => {
      this.onSubmit();
    });
  }

  ngOnInit() {
    this.handlePostalCodeRelatedProperties();
    this.clearFormWhenCountryChange();
    this.updateRegionWhenCityChanges();
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
    if (this.deliveryAddressForm.valid) {
      this.submitValidForm();
    } else {
      this.errorsService.i18nError(TRANSLATION_KEY.FORM_FIELD_ERROR);
      for (const control in this.deliveryAddressForm.controls) {
        if (this.deliveryAddressForm.controls.hasOwnProperty(control) && !this.deliveryAddressForm.controls[control].valid) {
          this.deliveryAddressForm.controls[control].markAsDirty();
        }
      }
    }
  }

  public handleShowWarningCountry(): void {
    if (!this.isNewForm && !this.isCountryEditable) {
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

  public clearFormWhenCountryChange(): void {
    const countryISOCode = this.deliveryAddressForm.get('country_iso_code');

    const subscription = countryISOCode.valueChanges.subscribe(() => {
      if (countryISOCode.dirty) {
        this.deliveryAddressForm.clearValidators();
        this.deliveryAddressForm.get('full_name').reset();
        this.deliveryAddressForm.get('street').reset();
        this.deliveryAddressForm.get('flat_and_floor').reset();
        this.deliveryAddressForm.get('postal_code').reset();
        this.deliveryAddressForm.get('city').reset();
        this.deliveryAddressForm.get('phone_number').reset();
      }
    });

    this.subscriptions.add(subscription);
  }

  public isIncorrectFormcontrol(formControlAtr: AbstractControl): boolean {
    return formControlAtr.invalid && (formControlAtr.dirty || formControlAtr.touched);
  }

  public updateRegionWhenCityChanges(): void {
    const city = this.deliveryAddressForm.get('city');

    const subscription = city.valueChanges.subscribe(() => {
      const currentDeliveryLocations = this.deliveryLocationsStoreService.deliveryLocations;
      if (city.dirty && currentDeliveryLocations.length > 1) {
        const selectedLocation = currentDeliveryLocations.find((location: DeliveryLocationApi) => location.city === city.value);
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

    this.isNewForm = false;
    this.patchCurrentForm(deliveryAddress);
    this.formComponent.initFormControl();
    this.initializeCountries(false);
    this.patchFormValues();
  }

  private handleNewForm(): void {
    this.loading = false;
    this.initializeCountries();
    this.patchFormValues();
    this.formComponent.initFormControl();
    this.isNewForm = true;
    this.buildForm();
  }

  private submitValidForm(): void {
    this.loading = true;
    this.deliveryAddressService
      .updateOrCreate(this.deliveryAddressForm.getRawValue(), this.isNewForm)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        () => {
          this.deliveryAddressStoreService.deliveryAddress = this.deliveryAddressForm.value;
          this.errorsService.i18nSuccess(TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_SUCCESS);
          this.formComponent.initFormControl();
          this.isNewForm = false;
          this.initForm(false);
          this.redirect();
        },
        (errors: HttpErrorResponse) => {
          const errorResponse: DeliveryAddressError[] = errors?.error;
          const generatedErrors = this.deliveryAddressErrorService.generateErrors(errorResponse);
          generatedErrors.forEach((generatedError: MappedAddressError) => {
            this.deliveryAddressForm.get(generatedError.formControlName).setErrors(null);
            this.deliveryAddressForm.get(generatedError.formControlName).setErrors({ incorrect: true });
            this.handleFormMessagesErrors(generatedError);
          });
        }
      );
  }

  private handleFormMessagesErrors(generatedError: MappedAddressError): void {
    if (generatedError.type === ADDRESS_ERROR_TYPE.FORM) {
      switch (generatedError.formControlName) {
        case 'phone_number':
          this.phoneNumberErrorMessage = generatedError.translation;
      }
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
      case PREVIOUS_PAGE.ADDRESS_VIEW:
        this.router.navigate([DELIVERY_PATHS.ADDRESSES_LIST]);
        break;
    }
  }

  private handlePostalCodeRelatedProperties(): void {
    const postalCode = this.deliveryAddressForm.get('postal_code');
    const countryISOCode = this.deliveryAddressForm.get('country_iso_code');

    const subscription = postalCode.valueChanges.subscribe((newPostalCode: string) => {
      if (postalCode.dirty) {
        this.deliveryAddressForm.get('city').reset();
        this.deliveryAddressForm.get('region').reset();
        if (postalCode.valid && postalCode.value.length === 5 && newPostalCode) {
          this.getLocationsAndHandlePostalCode(newPostalCode, countryISOCode.value);
        }
      }
    });

    this.subscriptions.add(subscription);
  }

  private getLocationsAndHandlePostalCode(postalCode: string, countryISOCode: string): void {
    this.deliveryLocationsService.getLocationsByPostalCodeAndCountry(postalCode, countryISOCode).subscribe(
      (locations: DeliveryLocationApi[]) => {
        this.initializeCitiesAsOptions(postalCode, countryISOCode).subscribe();
        this.handleLocationsResponse(locations);
      },
      () => {
        this.setIncorrectPostalCodeError();
        this.postalCodeErrorMessage = this.i18nService.translate(TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_NOT_ALLOWED_ERROR);
      }
    );
  }

  private handleLocationsResponse(locations: DeliveryLocationApi[]): void {
    if (!locations.length) {
      this.setIncorrectPostalCodeError();
      this.postalCodeErrorMessage = this.i18nService.translate(TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_MISSMATCH_LOCATION_ERROR);
    }
    if (locations.length === 1 && !this.deliveryAddressForm.get('city').value) {
      this.deliveryAddressForm.get('city').setValue(locations[0].city);
      this.deliveryAddressForm.get('region').setValue(locations[0].region);
    }
  }

  private setIncorrectPostalCodeError(): void {
    this.deliveryAddressForm.get('postal_code').setErrors(null);
    this.deliveryAddressForm.get('postal_code').setErrors({ incorrect: true });
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
        this.deliveryAddressForm.get('country').setValue(countryOptionsAndDefault.defaultCountry.iso_code);
      }
    });
  }

  private initializeCitiesAsOptions(postalCode: string, countryISOCode: string): Observable<DeliveryLocationApi[]> {
    return this.deliveryLocationsService.getLocationsByPostalCodeAndCountry(postalCode, countryISOCode).pipe(
      tap((locations: DeliveryLocationApi[]) => {
        this.cities = locations.map((location: DeliveryLocationApi) => {
          return { label: location.city, value: location.city };
        });
      })
    );
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

  private buildForm(): void {
    this.deliveryAddressForm = this.fb.group({
      id: this.uuidService.getUUID(),
      country_iso_code: ['', [Validators.required]],
      region: ['', [Validators.required]],
      full_name: ['', [Validators.required, whitespaceValidator]],
      street: ['', [Validators.required, whitespaceValidator]],
      flat_and_floor: [''],
      postal_code: ['', [Validators.required, whitespaceValidator, postalCodeValidator]],
      city: ['', [Validators.required]],
      phone_number: ['', [Validators.required, whitespaceValidator]],
    });
  }
}
