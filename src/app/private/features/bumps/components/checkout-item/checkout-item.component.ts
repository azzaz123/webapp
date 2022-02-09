import { takeWhile } from 'rxjs/operators';
import { Component, Input, OnDestroy, OnInit, OnChanges, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Duration, Product } from '@core/item/item-response.interface';
import { CartService } from '@shared/catalog/cart/cart.service';
import { CartChange } from '@shared/catalog/cart/cart-item.interface';
import { Cart } from '@shared/catalog/cart/cart';
import { CreditInfo } from '@core/payments/payment.interface';
import { ItemWithProducts } from '@api/core/model/bumps/item-products.interface';
import { BUMP_TYPE } from '@api/core/model/bumps/bump.interface';
import { Perks } from '@core/subscriptions/subscriptions.interface';

@Component({
  selector: 'tsl-checkout-item',
  templateUrl: './checkout-item.component.html',
  styleUrls: ['./checkout-item.component.scss'],
})
export class CheckoutItemComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() creditInfo: CreditInfo;
  @Input() itemWithProducts: ItemWithProducts;
  @Output() itemRemoved: EventEmitter<string> = new EventEmitter();
  public selectedType: Product;
  public availableTypes: Product[];
  public availableDurations: Duration[];
  public isFreeOptionSelected: boolean;
  public isFreeOptionAvailable: boolean;
  public isFreeOptionDisabled: boolean;
  public readonly BUMP_TYPES = BUMP_TYPE;
  private _selectedDuration: Duration;
  private active = true;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.createInstance(new Cart());
    this.isFreeOptionAvailable = !!this.getFreeTypes().length;
    this.isFreeOptionDisabled = !this.getFirstAvailableFreeOption() && !this.isFreeOptionSelected;

    if (this.isFreeOptionAvailable && !this.isFreeOptionDisabled) {
      this.isFreeOptionSelected = true;
    }
    this.getAvailableProducts();

    this.cartService.cart$.pipe(takeWhile(() => this.active)).subscribe((cartChange: CartChange) => {
      if (this.isFreeOptionAvailable) {
        this.isFreeOptionDisabled = !this.getFirstAvailableFreeOption() && !this.isFreeOptionSelected;
      }
      this.onRemoveOrClean(cartChange);
    });
  }

  get selectedDuration(): Duration {
    return this._selectedDuration;
  }

  set selectedDuration(value: Duration) {
    this._selectedDuration = value;
    this.addToCart();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.addToCart(); // TODO FIX CART MANAGE
    });
  }

  ngOnChanges() {
    if (this.creditInfo && !this.selectedType) {
      this.selectType(this.itemWithProducts.products[0]);
    }
  }

  ngOnDestroy() {
    this.active = false;
  }

  public getAvailableProducts(): void {
    if (this.isFreeOptionSelected) {
      this.availableTypes = this.getFreeTypes();
      const firstAvailableType = this.getFirstAvailableFreeOption();
      this.selectedType = this.availableTypes.find((type) => type.name === firstAvailableType.name);
      this.availableDurations = this.selectedType.durations;
      this.selectedDuration = this.selectedType.durations[0];
      this.increaseCounter();
    } else {
      this.availableTypes = this.itemWithProducts.products;
      this.selectedType = this.itemWithProducts.products[0];
      this.availableDurations = this.selectedType.durations;
      this.selectedDuration = this.selectedType.durations[this.selectedType.default_duration_index];
    }
  }

  public toggleItem() {
    if (!this.isFreeOptionSelected) {
      this.decreaseCounter();
    }
    this.getAvailableProducts();
  }

  public onRemoveItem(itemId: string, type: string): void {
    this.cartService.remove(itemId, type);
    this.itemRemoved.emit(itemId);
  }

  public selectDuration(duration: Duration): void {
    this.selectedDuration = duration;
  }

  public selectType(type: Product): void {
    this.selectedType = type;

    if (this.selectedDuration) {
      const newDuration = this.selectedType.durations.find((duration) => duration.duration === this.selectedDuration.duration);
      this.availableDurations = this.selectedType.durations;
      this.selectedDuration = newDuration ? newDuration : this.selectedType.durations[this.selectedType.default_duration_index];
    } else {
      this.selectedDuration = this.selectedType.durations[this.selectedType.default_duration_index];
    }
  }

  private addToCart(): void {
    const cartItem: any = {
      item: this.itemWithProducts.item,
      duration: this.selectedDuration,
      isFree: this.isFreeOptionSelected,
      isProvincialBump: this.itemWithProducts.isProvincialBump,
    };

    this.cartService.add(cartItem, this.selectedType.name);
  }

  private onRemoveOrClean(cartChange: CartChange): void {
    if ((cartChange.action === 'remove' && cartChange.itemId === this.itemWithProducts.item.id) || cartChange.action === 'clean') {
      this.selectedType = undefined;
      this.selectedDuration = undefined;
    }
  }

  private getFreeTypes(): Product[] {
    const freeTypes: Product[] = [];
    this.itemWithProducts.products.forEach((bumpType) => {
      const freeProducts = bumpType.durations.filter((duration) => duration.isFreeOption);

      if (freeProducts.length) {
        freeTypes.push({ ...bumpType, durations: freeProducts });
      }
    });
    return freeTypes;
  }

  private increaseCounter(): void {
    this.itemWithProducts.subscription.selected_tier.bumps.find((bump) => bump.name === this.selectedType.name).used++;
  }

  private decreaseCounter(): void {
    this.itemWithProducts.subscription.selected_tier.bumps.find((bump) => bump.name === this.selectedType.name).used--;
  }

  private getFirstAvailableFreeOption(): Perks {
    return this.itemWithProducts.subscription.selected_tier.bumps.find((bump) => bump.used < bump.quantity);
  }
}
