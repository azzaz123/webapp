import { Component, OnInit, Input } from '@angular/core';
import { Pack } from '../../../../core/payments/pack';
import { CartService } from '../../cart/cart.service';
import { CartProExtras } from '../../cart/cart-pro-extras';
import { CartProExtrasPack } from '../../cart/cart-item.interface';

@Component({
  selector: 'tsl-checkout-extras-pro-item',
  templateUrl: './checkout-extras-pro-item.component.html',
  styleUrls: ['./checkout-extras-pro-item.component.scss']
})
export class CheckoutExtrasProItemComponent {

  @Input() pack: Pack;

  constructor(private cartService: CartService) {
    this.cartService.createInstance(new CartProExtras());
  }

  select(pack: Pack) {
    console.log('select', pack);
    const cartProExtrasPack: CartProExtrasPack = {
      pack: pack
    };
    this.cartService.addProExtras(cartProExtrasPack, pack.name.toLowerCase());
  }
}
