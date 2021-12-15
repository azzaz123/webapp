import { Component, Input, OnDestroy, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UuidService } from '@core/uuid/uuid.service';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { EventService } from '@core/event/event.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { BankAccountService } from '@private/features/wallet/services/bank-account/bank-account.service';
import { distinctUntilChanged, finalize } from 'rxjs/operators';
import { BankAccount } from '@private/features/wallet/interfaces/bank-account/bank-account-api.interface';
import { Router } from '@angular/router';
import { BankAccountFormErrorMessages } from '@private/features/wallet/interfaces/bank-account/bank-account-form-error-messages.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { Location } from '@angular/common';
import {
  BankAccountError,
  IbanCountryIsInvalidError,
  IbanIsInvalidError,
  FirstNameIsInvalidError,
  PlatformResponseIsInvalidError,
  UniqueBankAccountByUserError,
  LastNameIsInvalidError,
} from '@private/features/wallet/errors/classes/bank-account';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { WALLET_PATHS } from '@private/features/wallet/wallet.routing.constants';
import { KYCTrackingEventsService } from '@private/features/wallet/modals/kyc/services/kyc-tracking-events/kyc-tracking-events.service';
import { BehaviorSubject } from 'rxjs';
import { BANK_ACCOUNT_TRANSLATIONS } from '@private/features/wallet/translations/bank-account.translations';
import { SeparateWordByCharacterPipe } from '@shared/pipes/separate-word-by-character/separate-word-by-character.pipe';
import { DeviceService } from '@core/device/device.service';
import { BANK_ACCOUNT_INPUTS_MAX_LENGTH } from '@private/features/delivery/enums/bank-account-inputs-length.enum';

export const IBAN_LENGTH = 40;
@Component({
  selector: 'tsl-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss'],
})
export class BankAccountComponent implements OnInit, OnDestroy {
  @ViewChild(ProfileFormComponent, { static: true }) formComponent: ProfileFormComponent;
  @Input() isKYC = false;

  @Output() bankAccountSaved: EventEmitter<void> = new EventEmitter();
  @Output() closeModal: EventEmitter<void> = new EventEmitter();

  public readonly loadingButton$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public readonly BANK_ACCOUNT_INPUTS_MAX_LENGTH = BANK_ACCOUNT_INPUTS_MAX_LENGTH;
  public bankAccountForm: FormGroup;
  public isNewForm = true;
  public maxLengthIBAN: number;
  public formErrorMessages: BankAccountFormErrorMessages = {
    iban: '',
    first_name: '',
    last_name: '',
  };

  public readonly BANK_DETAILS_URL = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BANK_DETAILS}`;

  constructor(
    private fb: FormBuilder,
    private uuidService: UuidService,
    private eventService: EventService,
    private toastService: ToastService,
    private router: Router,
    private bankAccountService: BankAccountService,
    private location: Location,
    private kycTrackingEventsService: KYCTrackingEventsService,
    private separateWordByCharacterPipe: SeparateWordByCharacterPipe,
    private deviceService: DeviceService
  ) {}

  ngOnInit(): void {
    this.trackPageViewEventWhenIsKYC();
    this.generateIBANMaxLength();
    this.buildForm();
    this.eventService.subscribe(EventService.FORM_SUBMITTED, () => {
      this.onSubmit();
    });
    this.formatIBANWhenChanges();
  }

  ngOnDestroy() {
    this.eventService.unsubscribeAll(EventService.FORM_SUBMITTED);
  }

  public initForm(): void {
    this.bankAccountService
      .get()
      .pipe(
        finalize(() => {
          this.loading$.next(false);
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
    this.trackClickKYCConfirmBankAccountInfoEventWhenIsKYC();
    if (this.loadingButton$.value) return;

    if (this.bankAccountForm.valid) {
      this.submitValidForm();
    } else {
      this.bankAccountForm.markAsPending();
      this.showToast(BANK_ACCOUNT_TRANSLATIONS.MISSING_INFO_ERROR, TOAST_TYPES.ERROR);
      for (const control in this.bankAccountForm.controls) {
        if (this.bankAccountForm.controls.hasOwnProperty(control) && !this.bankAccountForm.controls[control].valid) {
          this.bankAccountForm.controls[control].markAsDirty();
        }
      }
    }
  }

  public goBack(): void {
    this.location.back();
  }

  public canExit(): true | Promise<any> {
    return this.isKYC ? true : this.formComponent.canExit();
  }

  // TODO: Formating IBAN on blur event only for Android due to an unknown behaviour from Android OS
  public formatIbanOnAndroid(): void {
    const deviceOSName = this.deviceService.getOSName();
    const deviceIsNotAndroid = deviceOSName !== 'Android';
    if (deviceIsNotAndroid) {
      return;
    }

    const currentIBAN = this.bankAccountForm.get('iban').value;
    const formattedIBAN = this.separateWordByCharacterPipe.transform(currentIBAN, 4, ' ');
    this.bankAccountForm.patchValue({ iban: formattedIBAN });
  }

  private submitValidForm(): void {
    this.loadingButton$.next(true);

    const subscription = this.isNewForm
      ? this.bankAccountService.create(this.bankAccountForm.getRawValue())
      : this.bankAccountService.update(this.bankAccountForm.getRawValue());

    subscription
      .pipe(
        finalize(() => {
          this.loadingButton$.next(false);
        })
      )
      .subscribe(
        () => {
          const translationKey = this.isNewForm ? BANK_ACCOUNT_TRANSLATIONS.ADD_SUCCESS : BANK_ACCOUNT_TRANSLATIONS.EDIT_SUCCESS;

          this.showToast(translationKey, TOAST_TYPES.SUCCESS);
          this.isNewForm = false;
          this.formComponent.initFormControl();

          if (this.isKYC) {
            this.bankAccountSaved.emit();
          } else {
            this.router.navigate([this.BANK_DETAILS_URL]);
          }
        },
        (errors: BankAccountError[]) => {
          this.handleBankAccountErrors(errors);
        }
      );
  }

  private handleBankAccountErrors(errors: BankAccountError[]): void {
    let toastText: string = BANK_ACCOUNT_TRANSLATIONS.MISSING_INFO_ERROR;

    errors.forEach((error: BankAccountError) => {
      if (error instanceof IbanCountryIsInvalidError || error instanceof IbanIsInvalidError) {
        this.setIncorrectControlAndShowError('iban', error.message);
      }

      if (error instanceof FirstNameIsInvalidError) {
        this.setIncorrectControlAndShowError('first_name', error.message);
      }

      if (error instanceof LastNameIsInvalidError) {
        this.setIncorrectControlAndShowError('last_name', error.message);
      }

      if (error instanceof PlatformResponseIsInvalidError || error instanceof UniqueBankAccountByUserError) {
        toastText = BANK_ACCOUNT_TRANSLATIONS.SAVE_GENERIC_ERROR;
      }

      if (!(error instanceof PlatformResponseIsInvalidError) && !(error instanceof UniqueBankAccountByUserError)) {
        this.bankAccountForm.markAsPending();
      }
    });

    this.showToast(toastText, TOAST_TYPES.ERROR);
  }

  private setIncorrectControlAndShowError(formControl: string, message: string): void {
    this.bankAccountForm.get(formControl).setErrors(null);
    this.bankAccountForm.get(formControl).setErrors({ invalid: true });
    this.bankAccountForm.get(formControl).markAsDirty();
    this.formErrorMessages[formControl] = message;
  }

  private initializeAndPatchForm(): void {
    this.formComponent.initFormControl();
    this.patchFormValues();
  }

  private generateIBANMaxLength(): void {
    const spacingAllowed = IBAN_LENGTH / 4 - 1;
    this.maxLengthIBAN = IBAN_LENGTH + spacingAllowed;
  }

  private formatIBANWhenChanges(): void {
    const isAndroidDevice = this.deviceService.getOSName() === 'Android';
    if (isAndroidDevice) {
      return;
    }
    this.bankAccountForm
      .get('iban')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe((newIBAN: string) => {
        const formattedIBAN = this.separateWordByCharacterPipe.transform(newIBAN, 4, ' ');
        this.bankAccountForm.patchValue({ iban: formattedIBAN });
      });
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

  private showToast(text: string, type: TOAST_TYPES): void {
    this.toastService.show({
      text,
      type,
    });
  }

  private trackClickKYCConfirmBankAccountInfoEventWhenIsKYC(): void {
    if (this.isKYC) {
      this.kycTrackingEventsService.trackClickKYCConfirmBankAccountInfo();
    }
  }

  private trackPageViewEventWhenIsKYC(): void {
    if (this.isKYC) {
      this.kycTrackingEventsService.trackViewKYCBankAccountInfoScreen();
    }
  }
}
