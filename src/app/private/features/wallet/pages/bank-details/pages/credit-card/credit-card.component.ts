import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { EventService } from '@core/event/event.service';
import { UuidService } from '@core/uuid/uuid.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { concatMap, finalize } from 'rxjs/operators';
import { CreditCardSyncRequest } from '@api/core/model/cards/credit-card-sync-request.interface';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import {
  CardCountryIsInvalidError,
  CardCvvIsInvalidError,
  CardExpirationDateIsInvalidError,
  CardInvalidError,
  CardIsNotAuthorizedError,
  CardNotFoundError,
  CardNumberIsInvalidError,
  CardOwnerIsInvalidError,
  CardOwnerNameIsInvalidError,
  CardRegistrationFailedError,
  CardRegistrationIsInvalidError,
  CardTokenizationFailedError,
  CountryIsoCodeIsInvalidError,
  PaymentsCardsError,
  PlatformResponseIsInvalidError,
  UniqueCardForUserError,
} from '@api/core/errors/payments/cards';
import { CreditCardFormErrorMessages } from '@private/features/wallet/interfaces/credit-card/credit-card-form-error-messages.interface';
import { Location } from '@angular/common';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { WALLET_PATHS } from '@private/features/wallet/wallet.routing.constants';
import { BehaviorSubject } from 'rxjs';
import { CREDIT_CARD_TRANSLATIONS } from '@private/features/wallet/translations/credit-card.translations';

const BANK_DETAILS_URL = `/${PRIVATE_PATHS.WALLET}/${WALLET_PATHS.BANK_DETAILS}`;

@Component({
  selector: 'tsl-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss'],
})
export class CreditCardComponent implements OnInit, OnDestroy {
  @Input() returnRoute: string = BANK_DETAILS_URL;
  @Input() showBackButton: boolean = true;
  @Output() saved: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild(ProfileFormComponent, { static: true }) formComponent: ProfileFormComponent;

  public creditCardForm: FormGroup;
  public loading = false;
  public isNewForm = true;
  public readonly loadingButton$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public formErrorMessages: CreditCardFormErrorMessages = {
    fullName: '',
    cardNumber: '',
    cardExpirationDate: '',
    cardCvx: '',
  };

  constructor(
    private fb: FormBuilder,
    private uuidService: UuidService,
    private eventService: EventService,
    private toastService: ToastService,
    private paymentsCreditCardService: PaymentsCreditCardService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.eventService.subscribe(EventService.FORM_SUBMITTED, () => {
      this.onSubmit();
    });
  }

  ngOnDestroy(): void {
    this.eventService.unsubscribeAll(EventService.FORM_SUBMITTED);
  }

  public initForm(): void {
    this.paymentsCreditCardService
      .get()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (creditCard: CreditCard) => {
          if (creditCard?.id) {
            this.creditCardForm.get('id').setValue(creditCard.id);
          }
          this.isNewForm = !creditCard;
          this.initializeAndPatchForm();
        },
        () => {
          this.initializeAndPatchForm();
        }
      )
      .add(() => {
        this.creditCardForm.updateValueAndValidity();
      });
  }

  public onSubmit(): void {
    if (this.loadingButton$.value) return;

    if (this.creditCardForm.valid) {
      this.submitValidForm();
    } else {
      this.creditCardForm.markAsPending();
      this.showToast(CREDIT_CARD_TRANSLATIONS.MISSING_INFO_ERROR, TOAST_TYPES.ERROR);
      this.markInvalidFields();
    }
  }

  public goBack(): void {
    this.location.back();
  }

  public canExit(): true | Promise<any> {
    return this.formComponent.canExit();
  }

  private markInvalidFields(): void {
    for (const control in this.creditCardForm.controls) {
      if (this.creditCardForm.controls.hasOwnProperty(control) && !this.creditCardForm.controls[control].valid) {
        this.creditCardForm.controls[control].markAsDirty();
      }
    }
  }

  private submitValidForm(): void {
    this.loadingButton$.next(true);

    const subscription = this.isNewForm
      ? this.paymentsCreditCardService.create(this.getCreditCardSyncRequest()).pipe(concatMap(() => this.paymentsCreditCardService.get()))
      : this.paymentsCreditCardService.update(this.getCreditCardSyncRequest()).pipe(concatMap(() => this.paymentsCreditCardService.get()));

    subscription
      .pipe(
        finalize(() => {
          this.loadingButton$.next(false);
        })
      )
      .subscribe(
        () => {
          this.showToast(CREDIT_CARD_TRANSLATIONS.CREATE_SUCCESS, TOAST_TYPES.SUCCESS);
          this.isNewForm = false;
          this.formComponent.initFormControl();
          this.saved.emit();
          if (this.returnRoute?.length > 0) {
            this.router.navigate([this.returnRoute]);
          }
        },
        (errors: PaymentsCardsError[]) => {
          this.handleCreditCardErrors(errors);
        }
      );
  }

  private getCreditCardSyncRequest(): CreditCardSyncRequest {
    this.creditCardForm.getRawValue();
    const cardNumberFormatted = this.creditCardForm.get('cardNumber').value.replace(/ /g, '');
    const cardExpirationDateFormatted = this.creditCardForm.get('cardExpirationDate').value.replace('/', '');

    return {
      id: this.creditCardForm.get('id').value,
      fullName: this.creditCardForm.get('fullName').value,
      cardNumber: cardNumberFormatted,
      cardExpirationDate: cardExpirationDateFormatted,
      cardCvx: this.creditCardForm.get('cardCvx').value,
    };
  }

  private handleCreditCardErrors(errors: PaymentsCardsError[] | PaymentsCardsError): void {
    let toastText: string = CREDIT_CARD_TRANSLATIONS.MISSING_INFO_ERROR;

    if (errors instanceof Array) {
      errors.forEach((error: PaymentsCardsError) => {
        if (error instanceof CardIsNotAuthorizedError || error instanceof CardNumberIsInvalidError) {
          this.setIncorrectControlAndShowError('cardNumber', error.message);
        }

        if (error instanceof CardOwnerNameIsInvalidError) {
          this.setIncorrectControlAndShowError('fullName', error.message);
        }

        if (error instanceof CardExpirationDateIsInvalidError) {
          this.setIncorrectControlAndShowError('cardExpirationDate', error.message);
        }

        if (error instanceof CardCvvIsInvalidError) {
          this.setIncorrectControlAndShowError('cardCvx', error.message);
        }

        if (this.isGenericCreditCardError(error)) {
          toastText = error.message || CREDIT_CARD_TRANSLATIONS.GENERIC_ERROR;
        } else {
          this.creditCardForm.markAsPending();
        }
      });
    } else {
      toastText = errors.message;
    }

    this.showToast(toastText, TOAST_TYPES.ERROR);
  }

  private isGenericCreditCardError(error: PaymentsCardsError): boolean {
    return (
      error instanceof UniqueCardForUserError ||
      error instanceof PlatformResponseIsInvalidError ||
      error instanceof CountryIsoCodeIsInvalidError ||
      error instanceof CardTokenizationFailedError ||
      error instanceof CardRegistrationIsInvalidError ||
      error instanceof CardRegistrationFailedError ||
      error instanceof CardOwnerIsInvalidError ||
      error instanceof CardCountryIsInvalidError ||
      error instanceof CardNotFoundError
    );
  }

  private setIncorrectControlAndShowError(formControl: string, message: string): void {
    this.creditCardForm.get(formControl).setErrors(null);
    this.creditCardForm.get(formControl).setErrors({ invalid: true });
    this.creditCardForm.get(formControl).markAsDirty();
    this.formErrorMessages[formControl] = message;
  }

  private initializeAndPatchForm(): void {
    this.formComponent.initFormControl();
  }

  private buildForm(): void {
    this.creditCardForm = this.fb.group({
      id: this.uuidService.getUUID(),
      fullName: ['', Validators.required],
      cardNumber: ['', [Validators.required]],
      cardExpirationDate: ['', Validators.required],
      cardCvx: ['', [Validators.required]],
    });
  }

  private showToast(text: string, type: TOAST_TYPES): void {
    this.toastService.show({
      text,
      type,
    });
  }
}
