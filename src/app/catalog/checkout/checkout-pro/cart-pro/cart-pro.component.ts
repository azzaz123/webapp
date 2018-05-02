import { Component, OnInit } from '@angular/core';
import { CartPro, BUMP_PRO_TYPES } from './cart-pro';
import { CartProService } from './cart-pro.service';
import { CartProChange } from './cart-pro-item.interface';

@Component({
  selector: 'tsl-cart-pro',
  templateUrl: './cart-pro.component.html',
  styleUrls: ['./cart-pro.component.scss']
})
export class CartProComponent implements OnInit {

  public cart: CartPro;
  private active = true;
  public types: string[] = BUMP_PRO_TYPES;

  constructor(private cartProService: CartProService) { }

  ngOnInit() {
    this.cartProService.cart$.takeWhile(() => this.active).subscribe((cartChange: CartProChange) => {
      this.cart = cartChange.cart;
      console.log('here', this.cart);
    });
  }

}
