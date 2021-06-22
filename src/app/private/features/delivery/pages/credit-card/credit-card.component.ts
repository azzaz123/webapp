import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreditCard } from '@api/core/model/cards/credit-card.interface';
import { PaymentsCreditCardService } from '@api/payments/cards';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { UuidService } from '@core/uuid/uuid.service';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { ProfileFormComponent } from '@shared/profile/profile-form/profile-form.component';
import { finalize } from 'rxjs/operators';
import { DELIVERY_PATHS } from '../../delivery-routing-constants';
import * as moment from 'moment';

@Component({
  selector: 'tsl-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss'],
})
export class CreditCardComponent implements OnInit, OnDestroy {
  @ViewChild(ProfileFormComponent, { static: true }) formComponent: ProfileFormComponent;

  public creditCardForm: FormGroup;
  public loading = false;
  public isNewForm = true;
  public loadingButton = false;
  public formErrorMessages;

  private readonly formSubmittedEventKey = 'formSubmitted';

  constructor(
    private fb: FormBuilder,
    private uuidService: UuidService,
    private eventService: EventService,
    private toastService: ToastService,
    private i18nService: I18nService,
    private paymentsCreditCardService: PaymentsCreditCardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.eventService.subscribe(this.formSubmittedEventKey, () => {
      this.onSubmit();
    });
  }

  ngOnDestroy() {
    this.eventService.unsubscribeAll(this.formSubmittedEventKey);
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
          this.isNewForm = !creditCard;
          if (creditCard) {
            this.patchCurrentForm(creditCard);
          }
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
    this.loadingButton = true;
    const subscription = this.isNewForm
      ? this.paymentsCreditCardService.create(this.creditCardForm.getRawValue())
      : this.paymentsCreditCardService.update(this.creditCardForm.getRawValue());

    // the date need to be mapped

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
          this.router.navigate([DELIVERY_PATHS.BANK_DETAILS]);
        },
        (errors: any[]) => {
          this.handleCreditCardErrors(errors);
        }
      );
  }

  private handleCreditCardErrors(errors: any[]): void {
    let translationKey: TRANSLATION_KEY = TRANSLATION_KEY.BANK_ACCOUNT_MISSING_INFO_ERROR;

    this.showToast(translationKey, 'error');
  }

  private setIncorrectControlAndShowError(formControl: string, message: string): void {
    this.creditCardForm.get(formControl).setErrors(null);
    this.creditCardForm.get(formControl).setErrors({ invalid: true });
    this.creditCardForm.get(formControl).markAsDirty();
    this.formErrorMessages[formControl] = message;
  }

  private initializeAndPatchForm(): void {
    this.formComponent.initFormControl();
    this.patchFormValues();
  }

  private patchFormValues(): void {
    for (const control in this.creditCardForm.controls) {
      if (this.creditCardForm.controls.hasOwnProperty(control)) {
        this.creditCardForm.controls[control].markAsPristine();
      }
    }
  }

  private patchCurrentForm(creditCard: CreditCard): void {
    this.creditCardForm.patchValue({
      id: creditCard.id,
      fullName: creditCard.ownerFullName,
      cardNumber: creditCard.lastFourDigits,
      cardExpirationDate: moment(creditCard.expirationDate).format('MM/YYYY'),
      cardCvx: null,
    });
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

  private showToast(key: TRANSLATION_KEY, type: 'error' | 'success'): void {
    this.toastService.show({
      text: `${this.i18nService.translate(key)}`,
      type,
    });
  }
}
