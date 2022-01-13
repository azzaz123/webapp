import { takeWhile } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { ItemWithProducts } from '@core/item/item-response.interface';
import { keys } from 'lodash-es';
import { CartService } from '@shared/catalog/cart/cart.service';
import { CartChange, CartItem } from '@shared/catalog/cart/cart-item.interface';
import { BUMP_PROVINCIAL_TYPES, BUMP_TYPES } from '@shared/catalog/cart/cart-base';
import { Cart } from '@shared/catalog/cart/cart';
import { CreditInfo } from '@core/payments/payment.interface';

@Component({
  selector: 'tsl-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.scss'],
})
export class CheckoutItemComponent implements OnInit, OnDestroy, OnChanges {
  @Input() creditInfo: CreditInfo;
  @Input() itemWithProducts: ItemWithProducts;
  types: string[] = BUMP_TYPES;
  durations: string[];
  _duration: string;
  selectedType: string;
  selectedDuration: string;
  provincialBump: boolean;
  private active = true;

  set duration(value: string) {
    this._duration = value;
    if (this.selectedType) {
      this.select(this.selectedType);
    }
  }
  get duration(): string {
    return this._duration;
  }

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.createInstance(new Cart());
    this.durations = keys(this.itemWithProducts.products);
    this.duration = this.durations[1];
    this.cartService.cart$.pipe(takeWhile(() => this.active)).subscribe((cartChange: CartChange) => {
      this.onRemoveOrClean(cartChange);
    });
    this.provincialBump = !this.itemWithProducts.products['168'].citybump;
    if (this.provincialBump) {
      this.types = BUMP_PROVINCIAL_TYPES;
    }
  }

  ngOnChanges() {
    if (this.creditInfo && !this.selectedType) {
      this.selectedType = this.types[0];
      this.select(this.selectedType);
    }
  }

  ngOnDestroy() {
    this.active = false;
  }

  selectDuration(selectedDuration: string) {
    this.duration = selectedDuration;
  }

  select(type: string) {
    if (this.selectedType === type && this.selectedDuration === this.duration) {
      this.cartService.remove(this.itemWithProducts.item.id, type);
      return;
    }
    this.selectedType = type;
    this.selectedDuration = this.duration;
    this.itemWithProducts.item.flags.bump_type = type;
    this.itemWithProducts.item.flags.bumped = true;
    const cartItem: CartItem = {
      item: this.itemWithProducts.item,
      duration: this.itemWithProducts.products[this.selectedDuration][type],
    };
    this.cartService.add(cartItem, type);
  }

  private onRemoveOrClean(cartChange: CartChange) {
    if ((cartChange.action === 'remove' && cartChange.itemId === this.itemWithProducts.item.id) || cartChange.action === 'clean') {
      this.selectedType = undefined;
      this.selectedDuration = undefined;
      this.itemWithProducts.item.flags.bump_type = undefined;
      this.itemWithProducts.item.flags.bumped = false;
    }
  }
}
