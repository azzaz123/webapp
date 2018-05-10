import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { CartService } from '../../cart/cart.service';
import { CartProExtras } from '../../cart/cart-pro-extras';
import { CartChange } from '../../cart/cart-item.interface';
import { CartBase, BUMP_TYPES } from '../../cart/cart-base';
import { PaymentService } from '../../../../core/payments/payment.service';
import { FinancialCard, BillingInfoResponse, OrderProExtras } from '../../../../core/payments/payment.interface';
import { Pack } from '../../../../core/payments/pack';
import { ErrorsService } from '../../../../core/errors/errors.service';
import { Response } from '@angular/http';
import { TrackingService } from '../../../../core/tracking/tracking.service';

@Component({
  selector: 'tsl-cart-extras-pro',
  templateUrl: './cart-extras-pro.component.html',
  styleUrls: ['./cart-extras-pro.component.scss']
})
export class CartExtrasProComponent implements OnInit, OnDestroy {

  public cart: CartBase;
  public financialCard: FinancialCard;
  public types: string[] = BUMP_TYPES;
  public loading: boolean;
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();
  public cardType = 'old';
  private active = true;
  @Output() billingInfoNeeds: EventEmitter<boolean> = new EventEmitter();


  constructor(private cartService: CartService,
              private paymentService: PaymentService,
              private errorService: ErrorsService,
              private trackingService: TrackingService) { }

  ngOnInit() {
    this.cartService.createInstance(new CartProExtras());
    this.cartService.cart$.takeWhile(() => this.active).subscribe((cartChange: CartChange) => {
      this.cart = cartChange.cart;
    });
    this.getCard();
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
    this.paymentService.getBillingInfo().subscribe((info: BillingInfoResponse) => {
      const order: OrderProExtras = this.cart.prepareOrder();
      console.log('checkout', order);
      this.paymentService.orderExtrasProPack(order).subscribe(() => {
        this.track(order);
        this.buy(order.orderId);
      }, (error: Response) => {
        this.loading = false;
        if (error.text()) {
          this.errorService.show(error);
        } else {
          this.errorService.i18nError('bumpError');
        }
      });
    }, () => {
      this.billingInfoNeeds.emit(true);
    });
  }

  private buy(orderId: string) {
    console.log('order', orderId);
  }

  private track(order: OrderProExtras) {
    this.trackingService.track(TrackingService.PRO_PURCHASE_CHECKOUTPROEXTRACART, {selected_packs: order.packs});
  }

  private getCard() {
    this.paymentService.getFinancialCard().subscribe((financialCard: FinancialCard) => {
      this.financialCard = financialCard;
    });
  }
}
