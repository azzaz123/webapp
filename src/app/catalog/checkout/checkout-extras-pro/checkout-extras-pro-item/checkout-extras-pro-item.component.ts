import { Component, OnInit, Input } from '@angular/core';
import { Pack } from '../../../../core/payments/pack';
import { CartService } from '../../cart/cart.service';
import { CartItem } from '../../cart/cart-item.interface';

@Component({
  selector: 'tsl-checkout-extras-pro-item',
  templateUrl: './checkout-extras-pro-item.component.html',
  styleUrls: ['./checkout-extras-pro-item.component.scss']
})
export class CheckoutExtrasProItemComponent implements OnInit {

  @Input() pack: Pack;

  constructor(cartService: CartService) { }

  ngOnInit() {
    console.log('hwllo', this.pack);
  }
}
