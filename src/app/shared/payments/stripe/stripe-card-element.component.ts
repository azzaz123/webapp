import {
  Component,
  EventEmitter,
  forwardRef,
  OnInit,
  Output,
  Input,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  SimpleChanges
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm } from '@angular/forms';
import { FinancialCard, CreditInfo } from '../../../core/payments/payment.interface';
import { CartBase } from '../../catalog/cart/cart-base';
import { Cart } from '../../catalog/cart/cart';
import { CartService } from '../../catalog/cart/cart.service';
import { CartChange } from '../../catalog/cart/cart-item.interface';
import { TrackingService } from '../../../core/tracking/tracking.service';

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
  public fullName: string;
  public hasFinancialCard: boolean;
  public cardType = 'old';
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

  constructor(private cd: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.initStripe();
  }

  /*ngOnInit() {
    this.initStripe();
    this.card.addEventListener('change', this.cardHandler);
  }*/

  ngOnChanges(changes: SimpleChanges) {
    if (this.type === 'cart' && changes.cart.currentValue) {
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
      locale: 'es_ES'
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
