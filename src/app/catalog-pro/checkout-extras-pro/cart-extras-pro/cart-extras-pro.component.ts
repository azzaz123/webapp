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
import { OrderProExtras, FinancialCardOption } from '../../../core/payments/payment.interface';
import { StripeService } from '../../../core/stripe/stripe.service';
import { EventService } from '../../../core/event/event.service';
import { UUID } from 'angular2-uuid';
import { SplitTestService, WEB_PAYMENT_EXPERIMENT_TYPE } from '../../../core/tracking/split-test.service';

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
  public card: any;
  public isStripeCard = true;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public isStripe: boolean;
  public paymentMethod: WEB_PAYMENT_EXPERIMENT_TYPE;
  public paymentTypeSabadell = WEB_PAYMENT_EXPERIMENT_TYPE.sabadell;
  public paymentTypeStripeV1 = WEB_PAYMENT_EXPERIMENT_TYPE.stripeV1;
  public paymentTypeStripeV2 = WEB_PAYMENT_EXPERIMENT_TYPE.stripeV2;
  @Output() billingInfoMissing: EventEmitter<boolean> = new EventEmitter();
  @Input() billingInfoForm: FormGroup;
  @Input() billingInfoFormEnabled: boolean;


  constructor(private cartService: CartService,
              private paymentService: PaymentService,
              private errorService: ErrorsService,
              private trackingService: TrackingService,
              private router: Router,
              private errorsService: ErrorsService,
              private stripeService: StripeService,
              private eventService: EventService,
              private splitTestService: SplitTestService) { }

  ngOnInit() {
    this.splitTestService.getWebPaymentExperimentType().subscribe((paymentMethod: number) => {
      this.paymentMethod = paymentMethod;
      this.isStripe = this.paymentMethod !== this.paymentTypeSabadell;
      if (this.isStripe) {
        this.eventService.subscribe('paymentResponse', (response) => {
          this.managePaymentResponse(response);
        });
      }
    });
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
    const paymentId: string = UUID.UUID();
    if (this.isStripe) {
      order.provider = 'STRIPE';
    }
    this.paymentService.orderExtrasProPack(order).subscribe(() => {
      this.track(order);
      if (this.isStripe) {
        this.stripeService.buy(order.id, paymentId, this.isStripeCard, this.savedCard, this.card);
      } else {
        this.buy(order.id);
      }
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
    const payment_method = this.isStripe ? 'STRIPE' : 'SABADELL';
    this.trackingService.track(TrackingService.PRO_PURCHASE_CHECKOUTPROEXTRACART,
      {
        selected_packs: order.packs,
        payment_method
      });
  }

  public hasCard(hasCard: boolean) {
    this.hasFinancialCard = hasCard;
  }

  public hasStripeCard(hasCard: boolean) {
    this.isStripeCard = hasCard;
    if (!hasCard) {
      this.addNewCard();
    }
  }

  public setCardInfo(card: any): void {
    this.card = card;
  }

  private managePaymentResponse(paymentResponse: string): void {
    switch(paymentResponse && paymentResponse.toUpperCase()) {
      case 'SUCCEEDED': {
        this.router.navigate(['pro/catalog/list', {code: '200', extras: true}]);
        break;
      }
      default: {
        this.router.navigate(['pro/catalog/list', {code: -1}]);
        break;
      }
    }
  }

  public addNewCard() {
    this.showCard = true;
    this.savedCard = false;
  }

  public removeNewCard() {
    this.showCard = false;
    this.savedCard = true;
  }

  public setSavedCard(selectedCard: FinancialCardOption) {
    this.showCard = false;
    this.savedCard = true;
    this.selectedCard = true;
    this.setCardInfo(selectedCard);
  }
}
