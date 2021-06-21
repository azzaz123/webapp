import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UuidService } from '@core/uuid/uuid.service';
import { DELIVERY_INPUTS_MAX_LENGTH } from '../../enums/delivery-inputs-length.enum';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { EventService } from '@core/event/event.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { I18nService } from '@core/i18n/i18n.service';
import { BankAccountService } from '../../services/bank-account/bank-account.service';
import { finalize } from 'rxjs/operators';
import { BankAccount } from '../../interfaces/bank-account/bank-account-api.interface';
import { DELIVERY_PATHS } from '../../delivery-routing-constants';
import { Router } from '@angular/router';
import { BankAccountFormErrorMessages } from '../../interfaces/bank-account/bank-account-form-error-messages.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';

export const IBAN_LENGTH = 40;
@Component({
  selector: 'tsl-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss'],
})
export class BankAccountComponent implements OnInit, OnDestroy {
  @ViewChild(ProfileFormComponent, { static: true }) formComponent: ProfileFormComponent;

  public readonly DELIVERY_INPUTS_MAX_LENGTH = DELIVERY_INPUTS_MAX_LENGTH;
  public bankAccountForm: FormGroup;
  public loading = false;
  public loadingButton = false;
  public maxLengthIBAN: number;
  public formErrorMessages: BankAccountFormErrorMessages = {
    iban: '',
    first_name: '',
  };

  private isNewForm = true;
  private readonly formSubmittedEventKey = 'formSubmitted';

  constructor(
    private fb: FormBuilder,
    private uuidService: UuidService,
    private eventService: EventService,
    private toastService: ToastService,
    private i18nService: I18nService,
    private router: Router,
    private bankAccountService: BankAccountService
  ) {}

  ngOnInit(): void {
    this.generateIBANMaxLength();
    this.buildForm();
    this.eventService.subscribe(this.formSubmittedEventKey, () => {
      this.onSubmit();
    });
  }

  ngOnDestroy() {
    this.eventService.unsubscribeAll(this.formSubmittedEventKey);
  }

  public initForm(): void {
    this.bankAccountService
      .get()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (bankAccount: BankAccount) => {
          this.isNewForm = !bankAccount;
          if (bankAccount) {
            this.patchCurrentForm(bankAccount);
          }
          this.initializeAndPatchForm();
        },
        () => {
          this.initializeAndPatchForm();
        }
      )
      .add(() => {
        this.bankAccountForm.updateValueAndValidity();
      });
  }

  public onSubmit(): void {
    if (this.bankAccountForm.valid) {
      this.submitValidForm();
    } else {
      this.bankAccountForm.markAsPending();
      this.showToast(TRANSLATION_KEY.FORM_FIELD_ERROR, 'error');
      for (const control in this.bankAccountForm.controls) {
        if (this.bankAccountForm.controls.hasOwnProperty(control) && !this.bankAccountForm.controls[control].valid) {
          this.bankAccountForm.controls[control].markAsDirty();
        }
      }
    }
  }

  private submitValidForm(): void {
    this.loadingButton = true;
    const subscription = this.isNewForm
      ? this.bankAccountService.create(this.bankAccountForm.getRawValue())
      : this.bankAccountService.update(this.bankAccountForm.getRawValue());

    subscription
      .pipe(
        finalize(() => {
          this.loadingButton = false;
        })
      )
      .subscribe(
        () => {
          const translationKey = this.isNewForm
            ? TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_CREATE_SUCCESS
            : TRANSLATION_KEY.DELIVERY_BANK_ACCOUNT_EDIT_SUCCESS;

          this.showToast(translationKey, 'success');
          this.isNewForm = false;
          this.router.navigate([`${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.BANK_DETAILS}`]);
        },
        (errors: any) => {
          // TODO: map + handle our custom errors		Date: 2021/06/07
          this.showToast(TRANSLATION_KEY.FORM_FIELD_ERROR, 'error');
        }
      );
  }

  private initializeAndPatchForm(): void {
    this.formComponent.initFormControl();
    this.patchFormValues();
  }

  private generateIBANMaxLength(): void {
    const spacingAllowed = IBAN_LENGTH / 4 - 1;
    this.maxLengthIBAN = IBAN_LENGTH + spacingAllowed;
  }

  private patchFormValues(): void {
    for (const control in this.bankAccountForm.controls) {
      if (this.bankAccountForm.controls.hasOwnProperty(control)) {
        this.bankAccountForm.controls[control].markAsPristine();
      }
    }
  }

  private patchCurrentForm(bankAccount: BankAccount): void {
    this.bankAccountForm.patchValue({
      id: bankAccount.id,
      iban: bankAccount.iban,
      first_name: bankAccount.first_name,
      last_name: bankAccount.last_name,
      address: bankAccount.address,
      flat_and_floor: bankAccount.flat_and_floor,
      postal_code: bankAccount.postal_code,
      city: bankAccount.city,
    });
  }

  private buildForm(): void {
    this.bankAccountForm = this.fb.group({
      id: this.uuidService.getUUID(),
      iban: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      flat_and_floor: [''],
      postal_code: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });
  }

  private showToast(key: TRANSLATION_KEY, type: 'error' | 'success'): void {
    this.toastService.show({
      text: `${this.i18nService.translate(key)}`,
      type,
    });
  }
}
