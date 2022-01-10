import {
  Component,
  EventEmitter,
  forwardRef,
  Output,
  Input,
  ChangeDetectorRef,
  SimpleChanges,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  Inject,
  LOCALE_ID,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CartBase } from '../../catalog/cart/cart-base';
import { I18nService } from '@core/i18n/i18n.service';
import { StripeService } from '@core/stripe/stripe.service';
import { FinancialCard } from '@shared/payments-card-info/financial-card';
import { PaymentMethodResponse, SetupIntent } from '@core/payments/payment.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { Tier } from '@core/subscriptions/subscriptions.interface';
import { TERMS_AND_CONDITIONS_URL, PRIVACY_POLICY_URL } from '@core/constants';
import { STRIPE_ERROR } from '@core/stripe/stripe.interface';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { APP_LOCALE } from 'configs/subdomains.config';

@Component({
  selector: 'tsl-stripe-card-element',
  templateUrl: './stripe-card-element.component.html',
  styleUrls: ['./stripe-card-element.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StripeCardElementComponent),
      multi: true,
    },
  ],
})
export class StripeCardElementComponent implements ControlValueAccessor, AfterViewInit, OnChanges, OnDestroy {
  @Input() type: string;
  @Input() cart: CartBase;
  @Input() loading: boolean;
  @Input() newLoading: boolean;
  @Input() action: string;
  @Input() listingLimit: Tier;
  @Input() disabled: number;
  @Input() spaceBetween = false;
  @Input() showUseSavedCard = false;
  @Input() paymentError: STRIPE_ERROR;
  @Output() hasCard: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() stripeCard: EventEmitter<any> = new EventEmitter<any>();
  @Output() stripeCardToken: EventEmitter<string> = new EventEmitter<string>();
  @Output() handleStripeCardCreate: EventEmitter<PaymentMethodResponse> = new EventEmitter();
  @Output() handleStripeSetDefaultCard: EventEmitter<SetupIntent> = new EventEmitter();
  @Output() handleClickUseSavedCard = new EventEmitter();
  @Output() handleFocusCard = new EventEmitter<boolean>();

  public financialCard: FinancialCard;
  public hasFinancialCard: boolean;
  public card: stripe.elements.Element;
  public termsAndConditionsURL = TERMS_AND_CONDITIONS_URL;
  public policyPrivacyURL = PRIVACY_POLICY_URL;
  public errorTextConfig = {
    [STRIPE_ERROR.card_declined]: this.i18n.translate(TRANSLATION_KEY.CARD_NUMBER_INVALID),
    [STRIPE_ERROR.expired_card]: this.i18n.translate(TRANSLATION_KEY.CARD_DATE_INVALID),
    [STRIPE_ERROR.incorrect_cvc]: this.i18n.translate(TRANSLATION_KEY.CARD_CVC_INVALID),
  };
  cardHandler = this.onChange.bind(this);
  error: string;
  private _model = false;
  constructor(
    private cd: ChangeDetectorRef,
    private i18n: I18nService,
    private stripeService: StripeService,
    private toastService: ToastService,
    @Inject(LOCALE_ID) private locale: APP_LOCALE
  ) {}

  ngAfterViewInit() {
    this.initStripe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.type === 'cart' && changes.cart && changes.cart.currentValue) {
      this.cart.total = changes.cart.currentValue.total;
    }

    if (this.card && this.action === 'clear') {
      this.card.clear();
    }

    if (changes.listingLimit && changes.listingLimit.currentValue) {
      this.listingLimit = changes.listingLimit.currentValue;
    }

    if (changes.disabled && changes.disabled.currentValue) {
      this.disabled = changes.disabled.currentValue;
    }

    if (changes.newLoading && changes.newLoading.currentValue) {
      this.newLoading = changes.newLoading.currentValue;
    }
  }

  ngOnDestroy() {
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  public async onSubmit() {
    const { token, error } = await this.stripeService.createToken(this.card);

    if (error) {
      this.toastService.show({ text: error.message, type: TOAST_TYPES.ERROR });
    } else {
      this.stripeCardToken.emit(token.id);
    }
  }

  public createNewCard() {
    this.newLoading = true;
    this.stripeService
      .createStripeCard(this.card)
      .then((paymentMethod: PaymentMethodResponse) => {
        if (paymentMethod) {
          this.handleStripeCardCreate.emit(paymentMethod);
        } else {
          this.newLoading = false;
        }
      })
      .catch(() => (this.newLoading = false));
  }

  public setDefaultCard() {
    this.newLoading = true;
    this.stripeService.getSetupIntent().subscribe((clientSecret: any) => {
      this.stripeService
        .createDefaultCard(clientSecret.setup_intent, { card: this.card })
        .then((result: any) => {
          this.newLoading = false;
          if (result.setupIntent && result.setupIntent.payment_method) {
            this.handleStripeSetDefaultCard.emit(result.setupIntent);
          } else {
            this.error = result.error.message;
          }
        })
        .catch(() => (this.newLoading = false));
    });
  }

  public get model(): boolean {
    return this._model;
  }

  public set model(val: boolean) {
    this._model = val;
    this.onModelChange(val);
    this.onTouched();
  }

  public registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  public writeValue(value: boolean): void {
    this.model = value;
  }

  public registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

  public clickUseSavedCard() {
    this.handleClickUseSavedCard.emit(true);
  }

  public showSavedCardOption(): boolean {
    return this.type === 'subscription' && this.showUseSavedCard;
  }

  private onModelChange: any = () => {};

  private onTouched: any = () => {};

  private initStripe() {
    const elements = this.stripeService.lib.elements({
      locale: this.locale,
    });

    const style = {
      base: {
        iconColor: '#666ee8',
        color: '#292b2c',
        fontWeight: 400,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '15px',
        '::placeholder': {
          color: '#292b2c',
        },
        ':-webkit-autofill': {
          color: '#292b2c',
        },
      },
    };

    this.card = elements.create('card', { hidePostalCode: true, style });
    this.card.mount('#checkout-card');
    this.card.addEventListener('change', this.cardHandler);
    this.card.addEventListener('focus', () => this.handleFocusCard.emit(true));
    this.stripeCard.emit(this.card);
  }
}
