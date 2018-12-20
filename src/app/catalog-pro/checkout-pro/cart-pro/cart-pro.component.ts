import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BUMP_PRO_TYPES, CartBase } from '../../../shared/catalog/cart/cart-base';
import { CartPro } from '../../../shared/catalog/cart/cart-pro';
import { PerksModel } from '../../../core/payments/payment.model';
import { ScheduledStatus } from '../../../core/payments/payment.interface';
import { CartService } from '../../../shared/catalog/cart/cart.service';
import { ItemService } from '../../../core/item/item.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { PaymentService } from '../../../core/payments/payment.service';
import { CartChange, CartProItem } from '../../../shared/catalog/cart/cart-item.interface';
import { OrderPro } from '../../../core/item/item-response.interface';

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

  private calculateBalance() {
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
        this.router.navigate(['/pro/catalog/list', { code: this.isFutureOrderWithNoBalance() ? 202 : 201 }]);
      }
    }, (error) => {
      if (error.text()) {
        this.errorService.show(error);
      } else {
        this.errorService.i18nError('bumpError');
      }
    });
  }

  private isFutureOrderWithNoBalance(): boolean {
    const cityOrder: boolean = this.cart.citybump.total > 0 && this.balance.citybump <= 0;
    const countryOrder: boolean = this.cart.countrybump.total > 0 && this.balance.countrybump <= 0;
    return cityOrder || countryOrder;
  }

}
