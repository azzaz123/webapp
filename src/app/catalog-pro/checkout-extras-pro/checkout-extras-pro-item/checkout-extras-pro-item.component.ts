import { Component, OnInit, Input } from '@angular/core';
import { CartService } from '../../../shared/catalog/cart/cart.service';
import { CartProExtras } from '../../../shared/catalog/cart/cart-pro-extras';
import { Pack } from '../../../core/payments/pack';
import { CartProExtrasPack } from '../../../shared/catalog/cart/cart-item.interface';

@Component({
  selector: 'tsl-checkout-extras-pro-item',
  templateUrl: './checkout-extras-pro-item.component.html',
  styleUrls: ['./checkout-extras-pro-item.component.scss'],
})
export class CheckoutExtrasProItemComponent implements OnInit {
  @Input() pack: any;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.createInstance(new CartProExtras());
  }

  select(pack: Pack) {
    const cartProExtrasPack: CartProExtrasPack = {
      pack: pack,
    };
    this.cartService.addProExtras(cartProExtrasPack, pack.name.toLowerCase());
  }
}
