import { Injectable } from '@angular/core';
import { CartProItem } from './cart-pro-item.interface';

@Injectable()
export class CartProService {

  constructor() { }

  add(item: CartProItem) {
    console.log(item);
  }

}
