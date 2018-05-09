import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { CartService } from '../../cart/cart.service';
import { CartProExtras } from '../../cart/cart-pro-extras';
import { CartChange } from '../../cart/cart-item.interface';
import { CartBase, BUMP_TYPES } from '../../cart/cart-base';
import { PaymentService } from '../../../../core/payments/payment.service';
import { FinancialCard } from '../../../../core/payments/payment.interface';
import { Pack } from '../../../../core/payments/pack';

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
  private active = true;


  constructor(private cartService: CartService,
              private paymentService: PaymentService) { }

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

  checkout() {}

  private getCard() {
    this.paymentService.getFinancialCard().subscribe((financialCard: FinancialCard) => {
      this.financialCard = financialCard;
    });
  }
}
