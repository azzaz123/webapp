import { takeWhile } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { ItemWithProducts } from '@core/item/item-response.interface';
import { keys } from 'lodash-es';
import { CartService } from '@shared/catalog/cart/cart.service';
import { CartChange, CartItem } from '@shared/catalog/cart/cart-item.interface';
import { BUMP_TYPES } from '@shared/catalog/cart/cart-base';
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
  @Output() itemRemoved: EventEmitter<string> = new EventEmitter();
  types: string[] = BUMP_TYPES;
  durations: string[];
  _duration: string;
  selectedType: string;
  private active = true;

  set selectedDuration(value: string) {
    this._duration = value;
    if (this.selectedType) {
      if (this.itemWithProducts.products[this.selectedDuration][this.selectedType]) {
        this.select(this.selectedType);
      } else {
        this.selectedType = this.types[0];
        this.select(this.selectedType);
      }
    }
  }
  get selectedDuration(): string {
    return this._duration;
  }

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.createInstance(new Cart());
    this.durations = keys(this.itemWithProducts.products);
    this.selectedDuration = this.durations[1];

    this.cartService.cart$.pipe(takeWhile(() => this.active)).subscribe((cartChange: CartChange) => {
      this.onRemoveOrClean(cartChange);
    });
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

  public onRemoveItem(itemId: string, type: string): void {
    this.cartService.remove(itemId, type);
    this.itemRemoved.emit(itemId);
  }

  selectDuration(selectedDuration: string) {
    this.selectedDuration = selectedDuration;
  }

  select(type: string) {
    this.selectedType = type;
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
    }
  }
}
