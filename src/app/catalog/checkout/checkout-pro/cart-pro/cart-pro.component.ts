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
  public balance = { citybump: 0, countrybump: 0 };

  constructor(
    private cartService: CartService,
    private itemService: ItemService,
    private errorService: ErrorsService,
    private router: Router,
    private trackingService: TrackingService,
    private paymentsService: PaymentService) { }

  ngOnInit() {
    this.cartService.createInstance(new CartPro());

    this.cartService.cart$.subscribe((cartChange: CartChange) => {
      this.cart = cartChange.cart;
      this.calculateBalance();
    });

    this.paymentsService.getPerks(false).subscribe((perks: PerksModel) => {
      this.perks = perks;
      this.paymentsService.getStatus().subscribe((status: ScheduledStatus) => {
        this.status = status;
        console.log(this.status, JSON.stringify(this.perks));
        this.calculateBalance();
      });
    });
  }

  remove(cartItem: CartProItem) {
    this.cartService.remove(cartItem.item.id, cartItem.bumpType);
  }

  clean() {
    this.cartService.clean();
  }

  calculateBalance() {
    if (this.status.autorenew_scheduled.citybump) {
      this.balance['citybump'] = (this.perks.getBumpCounter() - this.status.autorenew_scheduled.citybump) - this.cart['citybump'].total;
    } else {
      this.balance['citybump'] = this.perks.getBumpCounter() - this.cart['citybump'].total;
    }
    if (this.status.autorenew_scheduled.countrybump) {
      this.balance['countrybump'] = (this.perks.getNationalBumpCounter() - this.status.autorenew_scheduled.countrybump) - this.cart['countrybump'].total;
    } else {
      this.balance['countrybump'] = this.perks.getNationalBumpCounter() - this.cart['countrybump'].total;
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
