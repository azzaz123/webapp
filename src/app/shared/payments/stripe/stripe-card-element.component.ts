import {
  Component,
  EventEmitter,
  forwardRef,
  Output,
  Input,
  ChangeDetectorRef,
  SimpleChanges, AfterViewInit, OnChanges, OnDestroy
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CartBase } from '../../catalog/cart/cart-base';
import { I18nService } from '../../../core/i18n/i18n.service';
import { StripeService } from '../../../core/stripe/stripe.service';
import { FinancialCard } from '../../profile/credit-card-info/financial-card';
import { PaymentMethodResponse } from '../../../core/payments/payment.interface';
import { ToastService } from '../../../layout/toast/toast.service';
import { Tier } from '../../../core/subscriptions/subscriptions.interface';
import { TERMS_AND_CONDITIONS_URL, PRIVACY_POLICY_URL } from '../../../core/constants';

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

  private _model = false;
  public financialCard: FinancialCard;
  public hasFinancialCard: boolean;
  public card: any;
  public termsAndConditionsURL = TERMS_AND_CONDITIONS_URL;
  public policyPrivacyURL = PRIVACY_POLICY_URL;
  @Input() type: string;
  @Input() cart: CartBase;
  @Input() loading: boolean;
  @Input() newLoading: boolean;
  @Input() action: string;
  @Input() listingLimit: Tier;
  @Input() disabled: number;
  @Input() spaceBetween = false;
  @Input() showUseSavedCard = false;
  @Input() isPaymentError: boolean;
  @Output() hasCard: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() stripeCard: EventEmitter<any> = new EventEmitter<any>();
  @Output() stripeCardToken: EventEmitter<string> = new EventEmitter<string>();
  @Output() onStripeCardCreate: EventEmitter<PaymentMethodResponse> = new EventEmitter();
  @Output() onClickUseSavedCard = new EventEmitter();
  @Output() onFocusCard = new EventEmitter<boolean>();

  cardHandler = this.onChange.bind(this);
  error: string;

  private onModelChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private cd: ChangeDetectorRef,
              private i18n: I18nService,
              private stripeService: StripeService,
              private toastService: ToastService) {
  }

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
    this.card.removeEventListener('change', this.cardHandler);
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

  private initStripe() {
    const elements = this.stripeService.lib.elements({
      locale: this.i18n.locale
    });

    const style = {
      base: {
        iconColor: '#666ee8',
        color: '#292b2c',
        fontWeight: 400,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
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
    this.card.addEventListener('focus', () => this.onFocusCard.emit(true));
    this.stripeCard.emit(this.card);
  }

  public async onSubmit() {
    const { token, error } = await this.stripeService.createToken(this.card);

    if (error) {
      this.toastService.error(error.message);
    } else {
      this.stripeCardToken.emit(token);
    }
  }

  public createNewCard() {
    this.newLoading = true;
    this.stripeService.createStripeCard(this.card).then((paymentMethod: PaymentMethodResponse) => {
      if (paymentMethod) {
        this.onStripeCardCreate.emit(paymentMethod);
      } else {
        this.newLoading = false;
      }
    }).catch(() => this.newLoading = false);
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
    this.onClickUseSavedCard.emit(true);
  }

}
