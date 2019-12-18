import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BUMP_TYPES, CartBase } from '../../../shared/catalog/cart/cart-base';
import { CartService } from '../../../shared/catalog/cart/cart.service';
import { CartProExtras } from '../../../shared/catalog/cart/cart-pro-extras';
import { ErrorsService } from '../../../core/errors/errors.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { PaymentService, PAYMENT_METHOD, PAYMENT_RESPONSE_STATUS } from '../../../core/payments/payment.service';
import { CartChange } from '../../../shared/catalog/cart/cart-item.interface';
import { Pack } from '../../../core/payments/pack';
import { OrderProExtras, FinancialCardOption } from '../../../core/payments/payment.interface';
import { StripeService } from '../../../core/stripe/stripe.service';
import { EventService } from '../../../core/event/event.service';
import { UUID } from 'angular2-uuid';

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
  public cardType = 'old';
  private active = true;
  public card: any;
  public isStripeCard = true;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
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
              private eventService: EventService) { }

  ngOnInit() {
    this.eventService.subscribe('paymentResponse', (response) => {
      this.managePaymentResponse(response);
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
    order.provider = PAYMENT_METHOD.STRIPE;
    this.paymentService.orderExtrasProPack(order).subscribe(() => {
      this.track(order);
      this.stripeService.buy(order.id, paymentId, this.isStripeCard, this.savedCard, this.card);
    }, (error: Response) => {
      this.loading = false;
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('bumpError');
      }
    });
  }

  private track(order: OrderProExtras) {
    const payment_method = PAYMENT_METHOD.STRIPE;
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
      case PAYMENT_RESPONSE_STATUS.SUCCEEDED: {
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
