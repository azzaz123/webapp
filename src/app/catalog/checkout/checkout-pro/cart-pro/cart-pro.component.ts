import { Component, OnInit } from '@angular/core';
import { CartChange, CartProItem } from '../../cart/cart-item.interface';
import { CartService } from '../../cart/cart.service';
import { CartBase, BUMP_PRO_TYPES } from '../../cart/cart-base';
import { CartPro } from '../../cart/cart-pro';
import { OrderPro } from '../../../../core/item/item-response.interface';
import { ItemService } from '../../../../core/item/item.service';
import { ErrorsService } from '../../../../core/errors/errors.service';
import { Router } from '@angular/router';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { PaymentService } from '../../../../core/payments/payment.service';
import { PerksModel } from '../../../../core/payments/payment.model';
import { ScheduledStatus } from '../../../../core/payments/payment.interface';

@Component({
  selector: 'tsl-cart-pro',
  templateUrl: './cart-pro.component.html',
  styleUrls: ['./cart-pro.component.scss']
})
export class CartProComponent implements OnInit {

  public cart: CartBase = new CartPro();
  public types: string[] = BUMP_PRO_TYPES;
  public perks: PerksModel;
  public status: ScheduledStatus;

  constructor(
    private cartService: CartService,
    private itemService: ItemService,
    private errorService: ErrorsService,
    private router: Router,
    private trackingService: TrackingService,
    private paymentsService: PaymentService) {
    this.cartService.cart$.subscribe((cartChange: CartChange) => {
      this.cart = cartChange.cart;
    });
  }

  ngOnInit() {
    this.cartService.createInstance(new CartPro());

    this.paymentsService.getPerks().subscribe((perks: PerksModel) => {
      this.perks = perks;
      this.paymentsService.getStatus().subscribe((status: ScheduledStatus) => {
        this.status = status;
      });
    });
  }

  remove(cartItem: CartProItem) {
    this.cartService.remove(cartItem.item.id, cartItem.bumpType);
  }

  clean() {
    this.cartService.clean();
  }

  getBalance(type: string) {
    if (this.status.autorenew_scheduled[type]) {
      let bumpsQuantity: number;
      if (type === 'citybump') {
        bumpsQuantity = this.perks.getBumpCounter();
      } else if (type === 'countrybump') {
        bumpsQuantity = this.perks.getNationalBumpCounter();
      }
      return (bumpsQuantity - this.status.autorenew_scheduled[type]) - this.cart[type].total;
    } else {
      return 0;
    }

  }

  applyBumps() {
    const order: OrderPro[] = this.cart.prepareOrder();
    this.itemService.bumpProItems(order).subscribe((failedProducts: string[]) => {
      if (failedProducts && failedProducts.length) {
        this.errorService.i18nError('bumpError');
      } else {
        this.itemService.deselectItems();
        this.trackingService.track(TrackingService.BUMP_PRO_APPLY, { selected_products: order });
        this.router.navigate(['/pro/catalog/list', { code: 200 }]);
      }
    }, (error) => {
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('bumpError');
      }
    });
  }

}
