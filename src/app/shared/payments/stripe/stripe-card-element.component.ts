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
  ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm } from '@angular/forms';
import { FinancialCard, CreditInfo } from '../../../core/payments/payment.interface';
import { PaymentService } from '../../../core/payments/payment.service';
import { ItemService } from '../../../core/item/item.service';
import { User } from '../../../core/user/user';
import { UserService } from '../../../core/user/user.service';
import { PurchaseProductsWithCreditsResponse, Order } from '../../../core/item/item-response.interface';
import { CartBase } from '../../catalog/cart/cart-base';
import { Cart } from '../../catalog/cart/cart';
import { CartService } from '../../catalog/cart/cart.service';
import { CartChange } from '../../catalog/cart/cart-item.interface';
import { EventService } from '../../../core/event/event.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { Router } from '@angular/router';
import { ErrorsService } from '../../../core/errors/errors.service';
import { StripeService } from '../../../core/stripe/stripe.service';

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
  public cart: CartBase;
  private active = true;
  public loading: boolean;
  public hasFinancialCard: boolean;
  public cardType = 'old';
  public card: any;
  @Input() creditInfo: CreditInfo;
  @Output() hasCard: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() stripeCard: EventEmitter<any> = new EventEmitter<any>();

  cardHandler = this.onChange.bind(this);
  error: string;

  private onModelChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private cd: ChangeDetectorRef,
              private cartService: CartService,
              private trackingService: TrackingService) {
    this.cartService.cart$.takeWhile(() => this.active).subscribe((cartChange: CartChange) => {
      this.cart = cartChange.cart;
    });
  }

  ngOnInit() {
    this.initStripe();
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
    this.cartService.createInstance(new Cart());

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

    this.card = elements.create('card', {style});
    this.card.mount('#checkout-card');

    this.card.on('change', ({error}) => {
      if (error) {
        this.error = error.message;
      } else {
        this.error = null;
      }
      //submitButton.disabled = false;
    });

    this.stripeCard.emit(this.card)
  }

  /*checkout() {
    this.loading = true;
    const order: Order[] = this.cart.prepareOrder();
    const orderId: string = this.cart.getOrderId();

    this.itemService.purchaseProductsWithCredits(order, orderId).subscribe((response: PurchaseProductsWithCreditsResponse) => {
      if (-this.usedCredits > 0) {
        localStorage.setItem('transactionType', 'bumpWithCredits');
        localStorage.setItem('transactionSpent', (-this.usedCredits).toString());
      } else {
        localStorage.setItem('transactionType', 'bump');
      }
      this.eventService.emit(EventService.TOTAL_CREDITS_UPDATED);
      this.track(order);
      if (response.payment_needed) {
        this.stripeService.buy(orderId);
      } else {
        this.success();
      }
    }, (error: any) => {
      this.loading = false;
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('bumpError');
      }
    });
  }*/

  /*private success() {
    this.itemService.deselectItems();
    this.itemService.selectedAction = null;
    this.router.navigate(['catalog/list', { code: 200 }]);
  }*/

  private track(order: Order[]) {
    const result = order.map(purchase => ({ item_id: purchase.item_id, bump_type: purchase.product_id }));
    const itemsIds = Object.keys(order).map(key => order[key].item_id);
    this.trackingService.track(TrackingService.MYCATALOG_PURCHASE_CHECKOUTCART, { selected_products: result });
    ga('send', 'event', 'Item', 'bump-cart');
    gtag('event', 'conversion', { 'send_to': 'AW-829909973/oGcOCL7803sQ1dfdiwM' });
    fbq('track', 'Purchase', {
      value: this.cart.total,
      currency: 'EUR',
      content_ids: itemsIds,
      content_type: 'product',
    });
    twq('track', 'Purchase', {
      value: this.cart.total,
      currency: 'EUR',
      num_items: order.length,
      content_ids: itemsIds,
      content_type: 'product',
      content_name: 'Bumps purchase'
    });
  }

  get usedCredits(): number {
    if (!this.cart) {
      return 0;
    }
    const totalCreditsToPay: number = this.cart.total * this.creditInfo.factor;
    if (totalCreditsToPay < this.creditInfo.credit) {
      return -totalCreditsToPay;
    } else {
      return -this.creditInfo.credit;
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
