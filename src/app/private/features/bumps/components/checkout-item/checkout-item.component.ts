import { takeWhile } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { Duration, Product } from '@core/item/item-response.interface';
import { CartService } from '@shared/catalog/cart/cart.service';
import { CartChange } from '@shared/catalog/cart/cart-item.interface';
import { Cart } from '@shared/catalog/cart/cart';
import { CreditInfo } from '@core/payments/payment.interface';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
import { ItemWithProducts } from '@api/core/model/bumps/item-products.interface';

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
  selectedType: Product;
  selectedDuration: Duration;
  availableTypes: Product[];
  availablesDurations: Duration[];
  onlyFree: boolean;
  private active = true;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.createInstance(new Cart());

    if (this.subscription?.selected_tier?.bumps?.length) {
      this.onlyFree = true;
    } else {
    }

    this.cartService.cart$.pipe(takeWhile(() => this.active)).subscribe((cartChange: CartChange) => {
      this.onRemoveOrClean(cartChange);
    });
  }

  ngOnChanges() {
    if (this.creditInfo && !this.selectedType) {
      this.selectedType = this.itemWithProducts.products[0];
      this.selectType(this.selectedType);
    }

    this.onToggleChange();
  }

  ngOnDestroy() {
    this.active = false;
  }

  public onToggleChange() {
    if (this.onlyFree) {
      this.availableTypes = this.getFreeTypes();
      this.selectedType = this.availableTypes[0];
      this.availablesDurations = this.selectedType.durations;
      this.selectedDuration = this.selectedType.durations[0];

      this.addToCart();
    } else {
      this.availableTypes = this.itemWithProducts.products;
      this.selectedType = this.itemWithProducts.products[0];
      this.availablesDurations = this.selectedType.durations;
      this.selectedDuration = this.selectedType.durations[this.selectedType.default_duration_index];

      this.addToCart();
    }
  }

  getFreeTypes(): Product[] {
    const freeTypes: Product[] = [];
    this.itemWithProducts.products.forEach((bumpType) => {
      const freeProducts = bumpType.durations.filter((duration) => duration.is_free);

      if (freeProducts.length) {
        freeTypes.push({ ...bumpType, durations: freeProducts });
      }
    });
    return freeTypes;
  }

  public onRemoveItem(itemId: string, type: string): void {
    this.cartService.remove(itemId, type);
    this.itemRemoved.emit(itemId);
  }

  public selectDuration(duration: Duration): void {
    this.selectedDuration = duration;
    this.addToCart();
  }

  public selectType(type: Product): void {
    this.selectedType = type;

    if (this.selectedDuration) {
      const newDuration = this.selectedType.durations.find((duration) => duration.duration === this.selectedDuration.duration);
      this.availablesDurations = this.selectedType.durations;
      this.selectedDuration = newDuration ? newDuration : this.selectedType.durations[this.selectedType.default_duration_index];
    } else {
      this.selectedDuration = this.selectedType.durations[this.selectedType.default_duration_index];
    }
    this.addToCart();
  }

  private addToCart(): void {
    const cartItem: any = {
      item: this.itemWithProducts.item,
      duration: this.selectedDuration,
      isFree: this.onlyFree,
    };
    this.cartService.add(cartItem, this.selectedType.name);
  }

  private onRemoveOrClean(cartChange: CartChange): void {
    if ((cartChange.action === 'remove' && cartChange.itemId === this.itemWithProducts.item.id) || cartChange.action === 'clean') {
      this.selectedType = undefined;
      this.selectedDuration = undefined;
    }
  }
}
