import { takeWhile } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BUMP_TYPES, CartBase } from '@shared/catalog/cart/cart-base';
import { CartService } from '@shared/catalog/cart/cart.service';
import { CartProExtras } from '@shared/catalog/cart/cart-pro-extras';
import { ErrorsService } from '@core/errors/errors.service';
import { PAYMENT_METHOD, PAYMENT_RESPONSE_STATUS, PaymentService } from '@core/payments/payment.service';
import { CartChange } from '@shared/catalog/cart/cart-item.interface';
import { Pack } from '@core/payments/pack';
import { FinancialCardOption, OrderProExtras } from '@core/payments/payment.interface';
import { StripeService } from '@core/stripe/stripe.service';
import { EventService } from '@core/event/event.service';
import { UuidService } from '@core/uuid/uuid.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Component({
  selector: 'tsl-cart-extras-pro',
  templateUrl: './cart-extras-pro.component.html',
  styleUrls: ['./cart-extras-pro.component.scss'],
})
export class CartExtrasProComponent implements OnInit, OnDestroy {
  @Output() billingInfoMissing: EventEmitter<boolean> = new EventEmitter();
  @Input() billingInfoForm: FormGroup;
  @Input() billingInfoFormEnabled: boolean;
  public card: any;
  public hasSavedCard = true;
  public showCard = false;
  public savedCard = true;
  public selectedCard = false;
  public cart: CartBase;
  public types: string[] = BUMP_TYPES;
  public loading: boolean;
  public cardType = 'old';
  private active = true;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private errorService: ErrorsService,
    private router: Router,
    private errorsService: ErrorsService,
    private stripeService: StripeService,
    private uuidService: UuidService,
    private eventService: EventService
  ) {}

  ngOnInit() {
    this.eventService.subscribe('paymentResponse', (response) => {
      this.managePaymentResponse(response);
    });
    this.cartService.createInstance(new CartProExtras());
    this.cartService.cart$.pipe(takeWhile(() => this.active)).subscribe((cartChange: CartChange) => {
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
    this.paymentService.getBillingInfo().subscribe(
      () => {
        this.processCheckout();
      },
      () => {
        this.billingInfoMissing.emit(true);
        this.loading = false;
      }
    );
  }

  saveAndCheckout() {
    this.loading = true;
    if (this.billingInfoForm.valid) {
      this.paymentService.updateBillingInfo(this.billingInfoForm.value).subscribe(
        () => {
          this.processCheckout();
          this.loading = false;
        },
        (e: HttpErrorResponse) => {
          this.errorsService.show(e);
          this.loading = false;
        }
      );
    }
  }

  public hasCard(hasCard: boolean) {
    this.hasSavedCard = hasCard;
    if (!hasCard) {
      this.addNewCard();
    }
  }

  public setCardInfo(card: any): void {
    this.card = card;
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

  private managePaymentResponse(paymentResponse: string): void {
    switch (paymentResponse && paymentResponse.toUpperCase()) {
      case PAYMENT_RESPONSE_STATUS.SUCCEEDED: {
        this.router.navigate(['pro/catalog/list', { code: '200', extras: true }]);
        break;
      }
      default: {
        this.router.navigate(['pro/catalog/list', { code: -1 }]);
        break;
      }
    }
  }

  private processCheckout() {
    const order: OrderProExtras = this.cart.prepareOrder();
    const paymentId: string = this.uuidService.getUUID();
    order.provider = PAYMENT_METHOD.STRIPE;
    this.paymentService.orderExtrasProPack(order).subscribe(
      () => {
        this.stripeService.buy(order.id, paymentId, this.hasSavedCard, this.savedCard, this.card);
      },
      (e: HttpErrorResponse) => {
        this.loading = false;
        if (e.error) {
          this.errorService.show(e);
        } else {
          this.errorService.i18nError(TRANSLATION_KEY.BUMP_ERROR);
        }
      }
    );
  }
}
