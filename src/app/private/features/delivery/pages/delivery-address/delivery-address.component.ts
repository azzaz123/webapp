import { CountryOptionsAndDefault, DeliveryCountriesService } from '../../services/delivery-countries/delivery-countries.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeCountryConfirmationModalComponent } from '../../modals/change-country-confirmation-modal/change-country-confirmation-modal.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DeliveryAddressStoreService } from '../../services/address/delivery-address-store/delivery-address-store.service';
import { DeliveryLocationService } from '../../services/delivery-location/delivery-location.service';
import { DeliveryAddressService } from '../../services/address/delivery-address/delivery-address.service';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { whitespaceValidator } from '@core/form-validators/formValidators.func';
import { postalCodeValidator } from '@core/form-validators/postalCodeValidator.func';
import { DeliveryLocationApi } from '../../interfaces/delivery-location/delivery-location-api.interface';
import { DeliveryAddressApi } from '../../interfaces/delivery-address/delivery-address-api.interface';
import { DropdownComponent } from '@shared/dropdown/dropdown.component';
import { HttpErrorResponse } from '@angular/common/http';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { DELIVERY_PATHS } from './../../delivery-routing-constants';
import { ErrorsService } from '@core/errors/errors.service';
import { Subscription } from 'rxjs';
import { EventService } from '@core/event/event.service';
import { UuidService } from '@core/uuid/uuid.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { Router } from '@angular/router';

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

  public countries: IOption[];
  public cities: IOption[];
  public deliveryAddressForm: FormGroup;
  public loading = true;
  public isNewForm = true;
  public isCountryEditable = false;
  private subscriptions: Subscription = new Subscription();
  public readonly PREVIOUS_PAGE = PREVIOUS_PAGE;
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
    private deliveryLocationService: DeliveryLocationService,
    private router: Router
  ) {
    this.buildForm();
    this.eventService.subscribe(this.formSubmittedEventKey, () => {
      this.onSubmit();
    });
  }

  ngOnInit() {
    this.handlePostalCodeRelatedProperties();
    this.clearFormWhenCountryChange();
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
        this.loading = false;
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
      if (!this.isNewForm && countryISOCode.dirty) {
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

  private handleExistingForm(deliveryAddress: DeliveryAddressApi): void {
    this.isNewForm = false;
    this.deliveryAddressForm.patchValue(deliveryAddress);
    this.formComponent.initFormControl();
    this.initializeCountries(false);
    this.patchFormValues();
  }

  private handleNewForm(): void {
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
        () => {
          this.errorsService.i18nError(TRANSLATION_KEY.DELIVERY_ADDRESS_SAVE_ERROR);
        }
      );
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
      if (postalCode.valid && postalCode.dirty) {
        this.deliveryAddressForm.get('city').reset();
        this.deliveryAddressForm.get('region').reset();
        if (newPostalCode) {
          this.getLocationsAndHandlePostalCode(newPostalCode, countryISOCode.value);
        }
      }
    });

    this.subscriptions.add(subscription);
  }

  private getLocationsAndHandlePostalCode(postalCode: string, countryISOCode: string): void {
    this.deliveryLocationService.getLocationsByPostalCodeAndCountry(postalCode, countryISOCode).subscribe(
      (locations: DeliveryLocationApi[]) => {
        this.cities = locations.map((location: DeliveryLocationApi) => {
          return { label: location.city, value: location.city };
        });
        this.handleLocationsResponse(locations);
      },
      (error: HttpErrorResponse) => {
        // TODO: prepare		Date: 2021/05/10
        // this.postalCodeError = error?.error[0]?.error_code;
      }
    );
  }

  private handleLocationsResponse(locations: DeliveryLocationApi[]): void {
    if (!locations.length) {
      this.deliveryAddressForm.get('postal_code').setErrors({ postal_code: true });
    }
    if (locations.length === 1 && !this.deliveryAddressForm.get('city').value) {
      this.deliveryAddressForm.get('city').setValue(locations[0].city);
      this.deliveryAddressForm.get('region').setValue(locations[0].region);
    }
  }

  private patchFormValues(): void {
    for (const control in this.deliveryAddressForm.controls) {
      if (this.deliveryAddressForm.controls.hasOwnProperty(control)) {
        this.deliveryAddressForm.controls[control].markAsPristine();
      }
    }
  }

  private initializeCountries(setDefaultOption = true): void {
    this.deliveryCountriesService.get().subscribe((countryOptionsAndDefault: CountryOptionsAndDefault) => {
      this.countries = countryOptionsAndDefault.countryOptions;
      if (setDefaultOption) {
        this.deliveryAddressForm.get('country').setValue(countryOptionsAndDefault.defaultCountry.iso_code);
      }
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
      city: [{ value: '', disabled: true }, [Validators.required]],
      phone_number: ['', [Validators.required, whitespaceValidator]],
    });
  }
}
