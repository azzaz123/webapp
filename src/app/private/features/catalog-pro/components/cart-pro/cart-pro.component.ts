import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BUMP_PRO_TYPES, CartBase } from '@shared/catalog/cart/cart-base';
import { CartPro } from '@shared/catalog/cart/cart-pro';
import { PerksModel } from '@core/payments/payment.model';
import { ScheduledStatus } from '@core/payments/payment.interface';
import { CartService } from '@shared/catalog/cart/cart.service';
import { ItemService } from '@core/item/item.service';
import { ErrorsService } from '@core/errors/errors.service';
import { PaymentService } from '@core/payments/payment.service';
import { CartChange, CartProItem } from '@shared/catalog/cart/cart-item.interface';
import { OrderPro } from '@core/item/item-response.interface';
import { some } from 'lodash-es';
import { HttpErrorResponse } from '@angular/common/http';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

export interface Balance {
  citybump: number;
  countrybump: number;
}

@Component({
  selector: 'tsl-cart-pro',
  templateUrl: './cart-pro.component.html',
  styleUrls: ['./cart-pro.component.scss'],
})
export class CartProComponent implements OnInit {
  public cart: CartBase = new CartPro();
  public types: string[] = BUMP_PRO_TYPES;
  public perks: PerksModel;
  public status: ScheduledStatus;
  public balance: Balance = { citybump: 0, countrybump: 0 };

  constructor(
    private cartService: CartService,
    private itemService: ItemService,
    private errorService: ErrorsService,
    private router: Router,
    private paymentsService: PaymentService
  ) {}

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

  applyBumps() {
    const order: OrderPro[] = this.cart.prepareOrder();
    const startsToday: boolean = some(order, (item: OrderPro) => {
      return new Date(item.start_date).toDateString() === new Date().toDateString();
    });
    this.itemService.bumpProItems(order).subscribe(
      (failedProducts: string[]) => {
        if (failedProducts && failedProducts.length) {
          this.errorService.i18nError(TRANSLATION_KEY.BUMP_ERROR);
        } else {
          this.itemService.deselectItems();
          let code = 201;
          if (this.isFutureOrderWithNoBalance()) {
            code = startsToday ? 203 : 202;
          }
          this.router.navigate(['/pro/catalog/list', { code: code }]);
        }
      },
      (e: HttpErrorResponse) => {
        if (e.error) {
          this.errorService.show(e);
        } else {
          this.errorService.i18nError(TRANSLATION_KEY.BUMP_ERROR);
        }
      }
    );
  }

  private calculateBalance() {
    const autorenewCitybump = (this.status.autorenew_scheduled.citybump || 0) + (this.status.autorenew_scheduled.zonebump || 0);
    if (autorenewCitybump) {
      this.balance['citybump'] = this.perks.getBumpCounter() - autorenewCitybump - this.cart['citybump'].total;
    } else {
      this.balance['citybump'] = this.perks.getBumpCounter() - this.cart['citybump'].total;
    }
    if (this.status.autorenew_scheduled.countrybump) {
      this.balance['countrybump'] =
        this.perks.getNationalBumpCounter() - this.status.autorenew_scheduled.countrybump - this.cart['countrybump'].total;
    } else {
      this.balance['countrybump'] = this.perks.getNationalBumpCounter() - this.cart['countrybump'].total;
    }
  }

  private getBalanceWithScheduled(): Balance {
    const autorenewCitybump = (this.status.autorenew_scheduled.citybump || 0) + (this.status.autorenew_scheduled.zonebump || 0);
    let balance: Balance = { citybump: 0, countrybump: 0 };
    if (autorenewCitybump) {
      balance['citybump'] = this.perks.getBumpCounter() - autorenewCitybump - this.cart['citybump'].total;
    } else {
      balance['citybump'] = this.perks.getBumpCounter() - this.cart['citybump'].total;
    }
    if (this.status.autorenew_scheduled.countrybump) {
      balance['countrybump'] =
        this.perks.getNationalBumpCounter() - this.status.autorenew_scheduled.countrybump - this.cart['countrybump'].total;
    } else {
      balance['countrybump'] = this.perks.getNationalBumpCounter() - this.cart['countrybump'].total;
    }
    return balance;
  }

  private isFutureOrderWithNoBalance(): boolean {
    const balanceWithScheduled: Balance = this.getBalanceWithScheduled();
    const cityOrder: boolean = this.cart.citybump.total > 0 && balanceWithScheduled.citybump <= 0;
    const countryOrder: boolean = this.cart.countrybump.total > 0 && balanceWithScheduled.countrybump <= 0;
    return cityOrder || countryOrder;
  }
}
