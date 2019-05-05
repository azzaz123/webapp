import {
  Component,
  EventEmitter,
  forwardRef,
  Output,
  Input,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm } from '@angular/forms';
import { FinancialCard } from '../../../core/payments/payment.interface';
import { CartBase } from '../../catalog/cart/cart-base';
import { I18nService } from '../../../core/i18n/i18n.service';

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
export class StripeCardElementComponent implements ControlValueAccessor {

  private _model: boolean = false;
  public financialCard: FinancialCard;
  public hasFinancialCard: boolean;
  public card: any;
  @Input() type: string;
  @Input() cart: CartBase;
  @Input() loading: boolean;
  @Output() hasCard: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() stripeCard: EventEmitter<any> = new EventEmitter<any>();
  @Output() stripeCardToken: EventEmitter<string> = new EventEmitter<string>();

  cardHandler = this.onChange.bind(this);
  error: string;

  private onModelChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private cd: ChangeDetectorRef,
              private i18n: I18nService) {
  }

  ngAfterViewInit() {
    this.initStripe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.type === 'cart' && changes.cart && changes.cart.currentValue) {
      this.cart.total = changes.cart.currentValue.total;
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
    const elements = stripe.elements({
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
    this.stripeCard.emit(this.card)
  }

  public async onSubmit() {
    const { token, error } = await stripe.createToken(this.card);

    if (error) {
      console.warn('Error:', error);
    } else {
      this.stripeCardToken.emit(token)
    }
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
}
