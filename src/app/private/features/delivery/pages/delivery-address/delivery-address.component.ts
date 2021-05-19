import { DeliveryAddressFormErrorMessages } from '@private/features/delivery/interfaces/delivery-address/delivery-address-error.interface';
import { CountryOptionsAndDefault, DeliveryCountriesService } from '../../services/countries/delivery-countries/delivery-countries.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeCountryConfirmationModalComponent } from '../../modals/change-country-confirmation-modal/change-country-confirmation-modal.component';
import { DeliveryAddressApi } from '../../interfaces/delivery-address/delivery-address-api.interface';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DeliveryAddressStoreService } from '../../services/address/delivery-address-store/delivery-address-store.service';
import { DeliveryLocationsService } from '../../services/locations/delivery-locations/delivery-locations.service';
import { DeliveryAddressService } from '../../services/address/delivery-address/delivery-address.service';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
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
import { finalize, map, tap } from 'rxjs/operators';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DeliveryAddressError, INVALID_DELIVERY_ADDRESS_CODE } from '../../errors/delivery-address/delivery-address-error';

export enum PREVIOUS_PAGE {
  PAYVIEW_ADD_ADDRESS,
  ADDRESSES_LIST,
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
  public locations: DeliveryLocationApi[] = [];
  public readonly PREVIOUS_PAGE = PREVIOUS_PAGE;
  public formErrorMessages: DeliveryAddressFormErrorMessages = {
    phone_number: '',
    postal_code: '',
    street: '',
    flat_and_floor: '',
  };
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
    private router: Router,
    private i18nService: I18nService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.eventService.subscribe(this.formSubmittedEventKey, () => {
      this.onSubmit();
    });
    this.clearFormWhenCountryChange();
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
    if (this.deliveryAddressForm.valid) {
      this.submitValidForm();
    } else {
      this.deliveryAddressForm.markAsPending();
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

  public isIncorrectFormcontrol(formControlAtr: AbstractControl, formName: string): boolean {
    const isValidAndEdited = formControlAtr.invalid && (formControlAtr.dirty || formControlAtr.touched);
    return formName === 'postal_code' ? isValidAndEdited : isValidAndEdited && this.deliveryAddressForm.pending;
  }

  private clearFormWhenCountryChange(): void {
    const countryISOCode = this.deliveryAddressForm.get('country_iso_code');

    const subscription = countryISOCode.valueChanges.subscribe(() => {
      if (countryISOCode.dirty) {
        this.resetCitiesAndLocations();
        this.deliveryAddressForm.clearValidators();
        this.deliveryAddressForm.get('full_name').reset();
        this.deliveryAddressForm.get('street').reset();
        this.deliveryAddressForm.get('flat_and_floor').reset();
        this.deliveryAddressForm.get('postal_code').reset();
        this.deliveryAddressForm.get('city').reset();
        this.deliveryAddressForm.get('phone_number').reset();
        this.deliveryAddressForm.get('region').reset();
      }
    });

    this.subscriptions.add(subscription);
  }

  private requestLocationsWhenPostalCodeChange(): void {
    const postalCode = this.deliveryAddressForm.get('postal_code');
    const countryISOCode = this.deliveryAddressForm.get('country_iso_code');

    const subscription = postalCode.valueChanges.subscribe((newPostalCode: string) => {
      if (postalCode.dirty) {
        this.resetCitiesAndLocations();
        this.deliveryAddressForm.get('city').reset();
        this.deliveryAddressForm.get('region').reset();
        if (postalCode.valid && newPostalCode.length === 5 && newPostalCode) {
          this.getLocationsAndHandlePostalCode(newPostalCode, countryISOCode.value);
        }
      }
    });

    this.subscriptions.add(subscription);
  }

  private updateRegionWhenCityChange(): void {
    const city = this.deliveryAddressForm.get('city');

    const subscription = city.valueChanges.subscribe(() => {
      if (city.dirty && this.locations.length > 1) {
        const selectedLocation = this.locations.find((location: DeliveryLocationApi) => location.city === city.value);
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
    this.buildForm();
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
          this.initForm(false);
          this.redirect();
        },
        (e: HttpErrorResponse) => {
          if (e.status === INVALID_DELIVERY_ADDRESS_CODE) {
            this.onError(e);
          } else {
            this.errorsService.i18nError(TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_ERROR);
          }
        }
      );
  }

  private onError(e: HttpErrorResponse): void {
    const errorResponse = e?.error;
    this.deliveryAddressForm.markAsPending();
    this.errorsService.i18nError(TRANSLATION_KEY.FORM_FIELD_ERROR);

    errorResponse.forEach((error) => {
      const generatedError = new DeliveryAddressError(error.error_code);
      this.deliveryAddressForm.get(generatedError.formControlName).setErrors(null);
      this.deliveryAddressForm.get(generatedError.formControlName).setErrors({ incorrect: true });
      this.formErrorMessages[generatedError.formControlName] = this.i18nService.translate(generatedError.translationKey);
    });

    throw new DeliveryAddressError(errorResponse[0].error_code);
  }

  private redirect(): void {
    switch (this.whereUserComes) {
      case PREVIOUS_PAGE.PAYVIEW_ADD_ADDRESS:
        this.router.navigate([DELIVERY_PATHS.PAYVIEW]);
        break;
      case PREVIOUS_PAGE.PAYVIEW_PAY:
        this.router.navigate([DELIVERY_PATHS.SHIPMENT_TRACKING]);
        break;
      case PREVIOUS_PAGE.ADDRESSES_LIST:
        this.router.navigate([DELIVERY_PATHS.ADDRESSES_LIST]);
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
        (e: HttpErrorResponse) => {
          if (e.status === INVALID_DELIVERY_ADDRESS_CODE) {
            this.onError(e);
          } else {
            this.setIncorrectControlAndShowError('postal_code', TRANSLATION_KEY.DELIVERY_ADDRESS_POSTAL_CODE_INVALID_ERROR);
            throw new DeliveryAddressError('invalid postal code');
          }
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
    this.deliveryAddressForm.get(formControl).setErrors({ incorrect: true });
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
}
