import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { whitespaceValidator } from '@core/form-validators/formValidators.func';
import { UuidService } from '@core/uuid/uuid.service';
import { IOption } from '@shared/dropdown/utils/option.interface';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { finalize } from 'rxjs/operators';
import { DeliveryAddressService } from '../../services/delivery-address/delivery-address.service';
import { CountryOptionsAndDefault, DeliveryCountriesService } from '../../services/delivery-countries/delivery-countries.service';

@Component({
  selector: 'tsl-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss'],
})
export class DeliveryAddressComponent {
  public countries: IOption[];
  public deliveryAddressForm: FormGroup;
  public loading = true;
  public loadingRequest = true;
  public isNewForm = true;
  private readonly formSubmittedEventKey = 'formSubmitted';

  @ViewChild(ProfileFormComponent, { static: true })
  formComponent: ProfileFormComponent;

  constructor(
    private fb: FormBuilder,
    private deliveryAddressService: DeliveryAddressService,
    private deliveryCountriesService: DeliveryCountriesService,
    private eventService: EventService,
    private errorsService: ErrorsService,
    private uuidService: UuidService
  ) {
    this.buildForm();
    this.eventService.subscribe(this.formSubmittedEventKey, () => {
      this.onSubmit();
    });
  }

  ngOnDestroy() {
    this.eventService.unsubscribeAll(this.formSubmittedEventKey);
  }

  public initForm(cache: boolean = true): void {
    this.deliveryAddressService
      .get(cache)
      .subscribe(
        (deliveryAddress: any) => {
          if (deliveryAddress) {
            this.isNewForm = false;
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
      this.errorsService.i18nError('');
      for (const control in this.deliveryAddressForm.controls) {
        if (this.deliveryAddressForm.controls.hasOwnProperty(control) && !this.deliveryAddressForm.controls[control].valid) {
          this.deliveryAddressForm.controls[control].markAsDirty();
        }
      }
    }
  }

  private handleNewForm(): void {
    this.initializeCountriesAndSetDefault();
    this.patchFormValues();
    this.formComponent.initFormControl();
    this.isNewForm = true;
    this.buildForm();
  }

  private patchFormValues(): void {
    for (const control in this.deliveryAddressForm.controls) {
      if (this.deliveryAddressForm.controls.hasOwnProperty(control)) {
        this.deliveryAddressForm.controls[control].markAsPristine();
      }
    }
  }

  private initializeCountriesAndSetDefault(): void {
    this.deliveryCountriesService.get().subscribe((countryOptionsAndDefault: CountryOptionsAndDefault) => {
      this.countries = countryOptionsAndDefault.countryOptions;
      this.deliveryAddressForm.get('country').setValue(countryOptionsAndDefault.defaultCountry.iso_code);
    });
  }

  private buildForm(): void {
    this.deliveryAddressForm = this.fb.group({
      id: this.uuidService.getUUID(),
      country_iso_code: ['', [Validators.required]],
      full_name: ['', [Validators.required, whitespaceValidator]],
      street: ['', [Validators.required, whitespaceValidator]],
      flat_and_floor: [''],
      postal_code: ['', [Validators.required, whitespaceValidator]],
      city: ['', [Validators.required, whitespaceValidator]],
      phone_number: ['', [Validators.required, whitespaceValidator]],
    });
  }
}
