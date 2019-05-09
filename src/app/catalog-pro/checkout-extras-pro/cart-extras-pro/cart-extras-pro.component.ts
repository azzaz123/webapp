import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BUMP_TYPES, CartBase } from '../../../shared/catalog/cart/cart-base';
import { CartService } from '../../../shared/catalog/cart/cart.service';
import { CartProExtras } from '../../../shared/catalog/cart/cart-pro-extras';
import { ErrorsService } from '../../../core/errors/errors.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { PaymentService } from '../../../core/payments/payment.service';
import { CartChange } from '../../../shared/catalog/cart/cart-item.interface';
import { Pack } from '../../../core/payments/pack';
import { OrderProExtras } from '../../../core/payments/payment.interface';
import { StripeService } from '../../../core/stripe/stripe.service';

@Component({
  selector: 'tsl-cart-extras-pro',
  templateUrl: './cart-extras-pro.component.html',
  styleUrls: ['./cart-extras-pro.component.scss']
})
export class CartExtrasProComponent implements OnInit, OnDestroy {

  public cart: CartBase;
  public hasFinancialCard: boolean;
  public types: string[] = BUMP_TYPES;
  public loading: boolean;
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();
  public cardType = 'old';
  private active = true;
  public isStripe: boolean;
  @Output() billingInfoMissing: EventEmitter<boolean> = new EventEmitter();
  @Input() billingInfoForm: FormGroup;
  @Input() billingInfoFormEnabled: boolean;


  constructor(private cartService: CartService,
              private paymentService: PaymentService,
              private errorService: ErrorsService,
              private trackingService: TrackingService,
              private router: Router,
              private errorsService: ErrorsService,
              private stripeService: StripeService) { }

  ngOnInit() {
    this.isStripe = this.stripeService.isPaymentMethodStripe();
    this.cartService.createInstance(new CartProExtras());
    this.cartService.cart$.takeWhile(() => this.active).subscribe((cartChange: CartChange) => {
      this.cart = cartChange.cart;
    });
  }

  ngOnDestroy() {
    this.active = false;
    this.cartService.clean();
  }

  remove(pack: Pack, index: number) {
    this.cartService.removeProExtras(pack.id, pack.name.toLowerCase(), index);
  }

  clean() {
    this.cartService.clean();
  }

  checkout() {
    this.loading = true;
    this.paymentService.getBillingInfo().subscribe(() => {
      this.processCheckout();
    }, () => {
      this.billingInfoMissing.emit(true);
      this.loading = false;
    });
  }

  saveAndCheckout() {
    this.loading = true;
    if (this.billingInfoForm.valid) {
      this.paymentService.updateBillingInfo(this.billingInfoForm.value).subscribe(() => {
        this.processCheckout();
        this.loading = false;
      }, (response: any) => {
        this.errorsService.show(response);
        this.loading = false;
      });
    }
  }

  private processCheckout() {
    const order: OrderProExtras = this.cart.prepareOrder();
    if (this.isStripe) {
      order.provider = 'STRIPE';
    }
    this.paymentService.orderExtrasProPack(order).subscribe(() => {
      this.track(order);
      this.buy(order.id);
    }, (error: Response) => {
      this.loading = false;
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('bumpError');
      }
    });
  }

  private buy(orderId: string) {
    if (!this.hasFinancialCard || this.hasFinancialCard && this.cardType === 'new') {
      this.sabadellSubmit.emit(orderId);
    } else {
      this.paymentService.pay(orderId).subscribe((response) => {
        this.router.navigate(['pro/catalog/list', {code: response.status, extras: true}]);
      }, () => {
        this.router.navigate(['pro/catalog/list', {code: -1}]);
      });
    }
  }

  private track(order: OrderProExtras) {
    this.trackingService.track(TrackingService.PRO_PURCHASE_CHECKOUTPROEXTRACART, {selected_packs: order.packs});
  }

  public hasCard(hasCard: boolean) {
    this.hasFinancialCard = hasCard;
  }
}
