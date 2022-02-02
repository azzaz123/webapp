import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemWithProducts } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { PaymentService } from '@core/payments/payment.service';
import { SubscriptionsResponse } from '@core/subscriptions/subscriptions.interface';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { BumpTutorialComponent } from '@shared/bump-tutorial/bump-tutorial.component';

@Component({
  selector: 'tsl-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  @ViewChild(BumpTutorialComponent, { static: true }) bumpTutorial: BumpTutorialComponent;
  itemsWithProducts: ItemWithProducts[];
  provincialBump: boolean;
  creditInfo: CreditInfo;
  subscriptions: SubscriptionsResponse[];

  constructor(
    private itemService: ItemService,
    private router: Router,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionsService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if (params.itemId) {
        this.getProductsFromParamsItem(params.itemId);
      } else {
        this.getProductsFromSelectedItems();
      }
    });
    this.getBumpsSubscription();
  }

  public removeItem(itemId: string): void {
    this.itemsWithProducts = this.itemsWithProducts.filter((itemWithProducts) => itemWithProducts.item.id !== itemId);
    if (this.itemsWithProducts.length === 0) {
      this.router.navigate(['catalog/list']);
    }
  }

  public subscriptionByCategoryId(categoryId) {
    const subscription = this.subscriptionService.getSubscriptionByCategory(this.subscriptions, categoryId);

    return this.subscriptionService.isSubscribed(subscription) ? subscription : null;
  }

  private getProductsFromSelectedItems(): void {
    if (!this.itemService.selectedItems.length) {
      this.router.navigate(['catalog/list']);
      return;
    }
    this.itemService
      .getItemsWithAvailableProducts(this.itemService.selectedItems)
      .subscribe((itemsWithProducts: ItemWithProducts[]) => this.setItems(itemsWithProducts));
  }

  private getProductsFromParamsItem(itemId: string): void {
    this.itemService
      .getItemsWithAvailableProducts([itemId])
      .subscribe((itemsWithProducts: ItemWithProducts[]) => this.setItems(itemsWithProducts));
  }

  private setItems(itemsWithProducts: ItemWithProducts[]): void {
    if (itemsWithProducts.length) {
      this.itemsWithProducts = itemsWithProducts;
      this.provincialBump = !this.itemsWithProducts[0].products['168'].citybump;
      this.itemsWithProducts.map((item) => {
        const itemMapped = item;
        const subscription = this.subscriptionByCategoryId(item.item.categoryId);
        if (subscription) {
          subscription.selected_tier.bumps.forEach((bump) => {
            itemMapped.products[bump.duration_days * 24][bump.name].is_free = true;
            itemMapped.products[bump.duration_days * 24][bump.name].subscriptionPackage = subscription.type;
          });
        }
        return itemMapped;
      });
    } else {
      this.router.navigate(['pro/catalog/list', { alreadyFeatured: true }]);
    }
    this.paymentService.getCreditInfo(false).subscribe((creditInfo: CreditInfo) => {
      if (creditInfo.credit === 0) {
        creditInfo.currencyName = 'wallacredits';
        creditInfo.factor = 1;
      }
      this.creditInfo = creditInfo;
    });
  }

  private getBumpsSubscription() {
    this.subscriptionService.getSubscriptions().subscribe((response) => {
      this.subscriptions = response;
    });
  }
}
