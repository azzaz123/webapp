import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { BUMP_TYPES, Cart } from './cart';
import { CartChange, CartItem } from './cart-item.interface';
import { Order } from '../../../core/item/item-response.interface';
import { ItemService } from '../../../core/item/item.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { Response } from '@angular/http';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { FinancialCard, Item, ItemBulkResponse, PaymentService } from 'shield';
import { Router } from '@angular/router';

@Component({
  selector: 'tsl-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  @Input() provincialBump: boolean;
  private active = true;
  public cart: Cart;
  public types: string[] = BUMP_TYPES;
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();
  public financialCard: FinancialCard;
  public cardType = 'old';
  public loading: boolean;

  constructor(private cartService: CartService,
              private itemService: ItemService,
              private errorService: ErrorsService,
              private trackingService: TrackingService,
              private paymentService: PaymentService,
              private router: Router) {
  }

  ngOnInit() {
    this.cartService.cart$.takeWhile(() => this.active).subscribe((cartChange: CartChange) => {
      this.cart = cartChange.cart;
    });
    this.getCard();
  }

  ngOnDestroy() {
    this.active = false;
  }

  remove(cartItem: CartItem, type: string) {
    this.cartService.remove(cartItem.item.id, type);
  }

  clean() {
    this.cartService.clean();
  }

  checkout() {
    const order: Order[] = this.cart.prepareOrder();
    const orderId: string = this.cart.getOrderId();
    this.loading = true;
    this.itemService.purchaseProducts(order, orderId).subscribe((failedProducts: string[]) => {
      this.track(order);
      this.buy(orderId);
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
    if (!this.financialCard || this.financialCard && this.cardType === 'new') {
      this.sabadellSubmit.emit(orderId);
    } else {
      this.paymentService.pay(orderId).subscribe(() => {
        this.itemService.deselectItems();
        this.itemService.selectedAction = null;
        this.router.navigate(['catalog/list', {code: 200}]);
      }, () => {
        this.router.navigate(['catalog/list', {code: -1}]);
      });
    }
  }

  private track(order: Order[]) {
    const result = order.map(purchase => ({item_id: purchase.item_id, bump_type: purchase.product_id}));
    this.trackingService.track(TrackingService.MYCATALOG_PURCHASE_CHECKOUTCART, {selected_products: result});
    ga('send', 'event', 'Item', 'bump-cart');
    gtag('event', 'conversion', {'send_to': 'AW-829909973/oGcOCL7803sQ1dfdiwM'});
    fbq('track', '176083133152402', {});
  }

  private getCard() {
    this.paymentService.getFinancialCard().subscribe((financialCard: FinancialCard) => {
      this.financialCard = financialCard;
    });
  }

}
