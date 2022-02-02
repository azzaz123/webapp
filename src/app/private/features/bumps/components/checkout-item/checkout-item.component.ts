import { takeWhile } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { ItemWithProducts } from '@core/item/item-response.interface';
import { keys } from 'lodash-es';
import { CartService } from '@shared/catalog/cart/cart.service';
import { CartChange, CartItem } from '@shared/catalog/cart/cart-item.interface';
import { BUMP_TYPES } from '@shared/catalog/cart/cart-base';
import { Cart } from '@shared/catalog/cart/cart';
import { CreditInfo } from '@core/payments/payment.interface';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.scss'],
})
export class CheckoutItemComponent implements OnInit, OnDestroy, OnChanges {
  @Input() creditInfo: CreditInfo;
  @Input() itemWithProducts: ItemWithProducts;
  @Input() subscription: SubscriptionsResponse;
  @Output() itemRemoved: EventEmitter<string> = new EventEmitter();
  types: string[] = BUMP_TYPES;
  durations: string[];
  _duration: string;
  selectedType: string;
  onlyFree: boolean;
  private active = true;

  set selectedDuration(value: string) {
    this._duration = value;
    if (this.selectedType) {
      if (this.itemWithProducts.products[this.selectedDuration][this.selectedType]) {
        if (this.onlyFree && !this.itemWithProducts.products[this.selectedDuration][this.selectedType].is_free) {
          this.selectedType = this.types[0];
        }
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

  public onToggleChange() {
    const parsedDurations = [];
    if (this.onlyFree) {
      this.types = [];

      this.durations.forEach((duration) => {
        if (this.hasOneFree(duration)) {
          parsedDurations.push(duration);
        }
      });
      this.durations = parsedDurations;
      this.selectedDuration = this.durations[0];
    } else {
      this.durations = keys(this.itemWithProducts.products);
      this.selectedDuration = this.durations[1];
      this.types = BUMP_TYPES;
    }
  }

  hasOneFree(duration): boolean {
    let isFree: boolean;
    const bumpTypes = keys(this.itemWithProducts.products[duration]);
    const aa = bumpTypes.find((bumpType) => this.itemWithProducts.products[duration][bumpType].is_free);

    bumpTypes.forEach((bumpType) => {
      if (this.itemWithProducts.products[duration][bumpType].is_free) {
        isFree = true;
        if (!this.types.includes(bumpType)) {
          this.types.push(bumpType);
        }
      }
    });
    return isFree;
  }

  public onRemoveItem(itemId: string, type: string): void {
    this.cartService.remove(itemId, type);
    this.itemRemoved.emit(itemId);
  }

  public selectDuration(selectedDuration: string): void {
    this.selectedDuration = selectedDuration;
  }

  public select(type: string): void {
    this.selectedType = type;
    const cartItem: CartItem = {
      item: this.itemWithProducts.item,
      duration: this.itemWithProducts.products[this.selectedDuration][type],
      isFree: this.onlyFree,
    };
    this.cartService.add(cartItem, type);
  }

  private onRemoveOrClean(cartChange: CartChange): void {
    if ((cartChange.action === 'remove' && cartChange.itemId === this.itemWithProducts.item.id) || cartChange.action === 'clean') {
      this.selectedType = undefined;
      this.selectedDuration = undefined;
    }
  }
}
