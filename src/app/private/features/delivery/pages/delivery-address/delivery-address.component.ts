import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { whitespaceValidator } from '@core/form-validators/formValidators.func';
import { UuidService } from '@core/uuid/uuid.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { finalize } from 'rxjs/operators';
import { DeliveryAddressService } from '../../services/delivery-address/delivery-address.service';
import { CountryOptionsAndDefault, DeliveryCountriesService } from '../../services/delivery-countries/delivery-countries.service';
import { ChangeCountryConfirmationModalComponent } from '../../modals/change-country-confirmation-modal/change-country-confirmation-modal.component';
import { DeliveryAddressApi } from '../../interfaces/delivery-address/delivery-address-api.interface';
import { DeliveryCountryISOCode, DeliveryLocationApi } from '../../interfaces/delivery-location/delivery-location-api.interface';
import { DeliveryLocationService } from '../../services/delivery-location/delivery-location.service';
import { postalCodeValidator } from '@core/form-validators/postalCodeValidator.func';

@Component({
  selector: 'tsl-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss'],
})
export class DeliveryAddressComponent implements OnInit {
  public countries: IOption[];
  public cities: IOption[];
  public deliveryAddressForm: FormGroup;
  public loading = true;
  public loadingRequest = true;
  public isNewForm = true;
  public isCountryEditable = false;
  private initialCountryISOCode: DeliveryCountryISOCode;
  private readonly formSubmittedEventKey = 'formSubmitted';

  @ViewChild(ProfileFormComponent, { static: true })
  formComponent: ProfileFormComponent;

  constructor(
    private fb: FormBuilder,
    private deliveryAddressService: DeliveryAddressService,
    private deliveryCountriesService: DeliveryCountriesService,
    private eventService: EventService,
    private errorsService: ErrorsService,
    private uuidService: UuidService,
    private modalService: NgbModal,
    private deliveryLocationService: DeliveryLocationService
  ) {
    this.buildForm();
    this.eventService.subscribe(this.formSubmittedEventKey, () => {
      this.onSubmit();
    });
  }

  ngOnInit() {
    this.handlePostalCode();
  }

  ngOnDestroy() {
    this.eventService.unsubscribeAll(this.formSubmittedEventKey);
  }

  public initForm(cache: boolean = true): void {
    this.deliveryAddressService
      .get(cache)
      .subscribe(
        (deliveryAddress: DeliveryAddressApi) => {
          if (deliveryAddress) {
            this.initialCountryISOCode = deliveryAddress.country_iso_code;
            this.isNewForm = false;
            this.initializeCountries(false);
            this.deliveryAddressForm.patchValue(deliveryAddress);
            this.patchFormValues();
            this.formComponent.initFormControl();
          } else {
            this.handleNewForm();
          }
        },
        () => {
          this.handleNewForm();
        }
      )
      .add(() => {
        // this.updateFieldsValidity();
        this.loading = false;
      });
  }

  public onSubmit(): void {
    if (this.deliveryAddressForm.valid) {
      this.loading = true;
      this.deliveryAddressService
        .update(this.deliveryAddressForm.getRawValue())
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(
          () => {
            this.errorsService.i18nSuccess('');
            this.formComponent.initFormControl();
            this.isNewForm = false;
            this.initForm(false);
          },
          (error: HttpErrorResponse) => {
            this.errorsService.show(error);
          }
        );
    } else {
      this.errorsService.i18nError('formErrors');
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
        }
      });
    }
  }

  public handleClearFrom(selectedOption: IOption): void {
    if (selectedOption.value !== this.initialCountryISOCode && !this.isNewForm) {
      this.deliveryAddressForm.clearValidators();
      this.deliveryAddressForm.get('full_name').reset();
      this.deliveryAddressForm.get('street').reset();
      this.deliveryAddressForm.get('flat_and_floor').reset();
      this.deliveryAddressForm.get('postal_code').reset();
      this.deliveryAddressForm.get('city').reset();
      this.deliveryAddressForm.get('phone_number').reset();
    }
  }

  private handleNewForm(): void {
    this.initializeCountries();
    this.patchFormValues();
    this.formComponent.initFormControl();
    this.isNewForm = true;
    this.buildForm();
  }

  private handlePostalCode(): void {
    const postalCode = this.deliveryAddressForm.get('postal_code');
    const countryISOCode = this.deliveryAddressForm.get('country_iso_code');

    postalCode.valueChanges.subscribe((newPostalCode: string) => {
      if (postalCode.valid && countryISOCode.value) {
        this.deliveryAddressForm.get('city').reset();
        this.deliveryAddressForm.get('region').reset();

        if (newPostalCode) {
          this.getLocations(newPostalCode, 'ES');
        }
      }
    });
  }

  private getLocations(postalCode: string, countryISOCode: 'ES' | 'IT'): void {
    this.deliveryLocationService
      .getLocationsByPostalCodeAndCountry(postalCode, countryISOCode)
      .subscribe((locations: DeliveryLocationApi[]) => {
        this.cities = locations.map((location) => {
          return { label: location.city, value: location.city };
        });
        if (locations.length === 1 && !this.deliveryAddressForm.get('city').value) {
          this.deliveryAddressForm.get('city').setValue(locations[0].city);
          this.deliveryAddressForm.get('region').setValue(locations[0].region);
        }
      });
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
