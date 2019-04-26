import {
  Component,
  EventEmitter,
  forwardRef,
  OnInit,
  Output,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm } from '@angular/forms';
import { FinancialCard } from '../../../core/payments/payment.interface';
import { PaymentService } from '../../../core/payments/payment.service';
import { StripeService } from '../../../core/stripe/stripe.service';
import { User } from '../../../core/user/user';
import { UserService } from '../../../core/user/user.service';

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
export class StripeCardElementComponent implements OnInit, ControlValueAccessor {

  private _model: boolean = false;
  public financialCard: FinancialCard;
  public fullName: string;
  @Output() hasCard: EventEmitter<boolean> = new EventEmitter<boolean>();

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  private onModelChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private paymentService: PaymentService,
              private stripeService: StripeService,
              private userService: UserService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.userService.me().subscribe((user: User) => {
      this.fullName = user.firstName + ' ' + user.lastName;
    });

    const form = document.getElementById('payment-form');
    const submitButton = form.querySelector('button[type=submit]');

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

    const card = elements.create('card', {style});
    card.mount('#checkout-card');

    card.on('change', ({error}) => {
      if (error) {
        this.error = error.message;
      } else {
        this.error = null;
      }
      //submitButton.disabled = false;
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const clientSecret = 'pi_1EIHptKhcEtiGcVWMlVsuco6_secret_dJIA3cR24luGO9Ge9HbT6ltfE';
      const fullName = this.fullName;
      
      const response = await stripe.handleCardPayment(
        clientSecret, card, {
          source_data: {
            owner: {name: fullName}
          }
        }
      );
      handlePayment(response);
    });

    const handlePayment = paymentResponse => {
      const { paymentIntent, error } = paymentResponse;

      if (error) {
          console.log(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment OK');
      } else if (paymentIntent.status === 'processing') {
        console.log('...payment processing...');
      } else {
        console.log('Unknown');
      }
    };
    
  }

  ngOnDestroy() {
    //this.card.removeEventListener('change', this.cardHandler);
    //this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
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
