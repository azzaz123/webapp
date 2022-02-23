import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BumpRequestSubject, BUMP_SERVICE_TYPE, ItemsBySubscription, SelectedProduct } from '@api/core/model/bumps/item-products.interface';
import { VisibilityApiService } from '@api/visibility/visibility-api.service';
import { ItemService } from '@core/item/item.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { PaymentService } from '@core/payments/payment.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { BumpTutorialComponent } from '@shared/bump-tutorial/bump-tutorial.component';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { modalConfig, PRO_MODAL_TYPE } from '@shared/modals/pro-modal/pro-modal.constants';

@Component({
  selector: 'tsl-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  @ViewChild(BumpTutorialComponent, { static: true }) bumpTutorial: BumpTutorialComponent;
  public itemsWithProducts: ItemsBySubscription[];
  public creditInfo: CreditInfo;
  public user: User;
  public itemsSelected: SelectedProduct[] = [];

  errorMapper = {
    409: PRO_MODAL_TYPE.bump_error_limit_reached,
    404: PRO_MODAL_TYPE.bump_error_not_found,
    500: PRO_MODAL_TYPE.bump_error_generic,
  };

  constructor(
    private itemService: ItemService,
    private router: Router,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private visibilityApiService: VisibilityApiService,
    private modalService: NgbModal,
    private userService: UserService
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
    this.user = this.userService.user;
  }

  public onRemoveItem(itemId: string, productIndex: number): void {
    this.itemsWithProducts[productIndex].items = this.itemsWithProducts[productIndex].items.filter(
      (itemWithProducts) => itemWithProducts.item.id !== itemId
    );

    if (this.itemsWithProducts[productIndex].items.length === 0) {
      this.itemsWithProducts.splice(productIndex, 1);
    }

    const indexCart = this.itemsSelected.findIndex((item) => item.item.id === itemId);
    if (indexCart > -1) {
      this.itemsSelected.splice(indexCart, 1);
    }

    if (this.itemsWithProducts.length === 0) {
      this.router.navigate(['catalog/list']);
    }
    this.refreshCounters(productIndex);
  }

  public onChangeItem(newItem: SelectedProduct, productIndex: number): void {
    const indexCart = this.itemsSelected.findIndex((itemSelected) => itemSelected.item.id === newItem.item.id);
    if (indexCart > -1) {
      this.itemsSelected[indexCart] = newItem;
    } else {
      this.itemsSelected.push(newItem);
    }
    this.refreshCounters(productIndex);
  }

  public onConfirm(): void {
    this.itemService.deselectItems();
    this.itemService.selectedAction = null;

    const modalRef: NgbModalRef = this.modalService.open(ProModalComponent, {
      windowClass: 'pro-modal',
    });

    modalRef.componentInstance.modalConfig =
      this.itemsSelected.length > 1 ? modalConfig[PRO_MODAL_TYPE.bump_success_plural] : modalConfig[PRO_MODAL_TYPE.bump_success];

    modalRef.result.then(
      () => {
        this.router.navigate(['catalog/list']);
      },
      () => {
        this.router.navigate(['catalog/list']);
      }
    );
  }

  public onError(errors: BumpRequestSubject[]): void {
    const modalRef: NgbModalRef = this.modalService.open(ProModalComponent, {
      windowClass: 'pro-modal',
    });

    if (errors.length === 1) {
      if (errors[0].service === BUMP_SERVICE_TYPE.SUBSCRIPTION_BUMPS) {
        if (Object.keys(this.errorMapper).includes(errors[1].error.toString())) {
          modalRef.componentInstance.modalConfig = modalConfig[this.errorMapper[errors[1].error.toString()]];
        } else {
          modalRef.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.bump_error_generic];
        }
      }
      if (errors[0].service === BUMP_SERVICE_TYPE.STRIPE) {
        modalRef.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.bump_error_generic];
      }
      return;
    }
    modalRef.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.bump_error_generic];
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
    } else {
      this.router.navigate(['pro/catalog/list', { alreadyFeatured: true }]);
    }
  }

  private refreshCounters(productIndex: number): void {
    if (this.itemsWithProducts[productIndex].subscription?.selected_tier) {
      const items = this.itemsWithProducts[productIndex].subscription.selected_tier.bumps.reduce((a, b) => a + b.quantity - b.used, 0);
      const used = this.itemsSelected.filter(
        (items) => items.isFree && items.duration.subscriptionPackageType === this.itemsWithProducts[productIndex].subscription.type
      ).length;
      this.itemsWithProducts[productIndex].availableFreeBumps = items - used;
    }
  }
}
