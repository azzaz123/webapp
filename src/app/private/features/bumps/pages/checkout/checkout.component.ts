import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemsBySubscription, ItemWithProducts } from '@api/core/model/bumps/item-products.interface';
import { VisibilityApiService } from '@api/visibility/visibility-api.service';
import { ItemService } from '@core/item/item.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { PaymentService } from '@core/payments/payment.service';
import { BumpTutorialComponent } from '@shared/bump-tutorial/bump-tutorial.component';

@Component({
  selector: 'tsl-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  @ViewChild(BumpTutorialComponent, { static: true }) bumpTutorial: BumpTutorialComponent;
  itemsWithProducts: ItemsBySubscription[];
  provincialBump: boolean;
  creditInfo: CreditInfo;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private visibilityApiService: VisibilityApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if (params.itemId) {
        this.getProductsFromParamsItem(params.itemId);
      } else {
        this.getProductsFromSelectedItems();
      }
    });
    this.getCreditInfo();
  }

  public removeItem(itemId: string): void {
    // this.itemsWithProducts = this.itemsWithProducts.filter((itemWithProducts) => itemWithProducts.item.id !== itemId);
    if (this.itemsWithProducts.length === 0) {
      this.router.navigate(['catalog/list']);
    }
  }

  private getProductsFromSelectedItems(): void {
    if (!this.itemService.selectedItems.length) {
      this.router.navigate(['catalog/list']);
      return;
    }
    this.visibilityApiService
      .getItemsWithProductsAndSubscriptionBumps(this.itemService.selectedItems)
      .subscribe((itemsWithProducts) => this.setItems(itemsWithProducts));
  }

  private getProductsFromParamsItem(itemId: string): void {
    this.visibilityApiService.getItemsWithProductsAndSubscriptionBumps([itemId]).subscribe((itemsWithProducts) => {
      this.setItems(itemsWithProducts);
    });
  }

  private getCreditInfo(): void {
    this.paymentService.getCreditInfo(false).subscribe((creditInfo: CreditInfo) => {
      if (creditInfo.credit === 0) {
        creditInfo.currencyName = 'wallacredits';
        creditInfo.factor = 1;
      }
      this.creditInfo = creditInfo;
    });
  }

  private setItems(itemsWithProducts: ItemsBySubscription[]): void {
    if (itemsWithProducts.length) {
      this.itemsWithProducts = itemsWithProducts;
      console.log('test', this.itemsWithProducts);
    } else {
      this.router.navigate(['pro/catalog/list', { alreadyFeatured: true }]);
    }
  }
}
