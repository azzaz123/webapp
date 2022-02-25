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
import { PACKS_TYPES } from '@core/payments/pack';
import { ProModalConfig } from '@shared/modals/pro-modal/pro-modal.interface';

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

  private readonly freeBumpsErrorMapper: Record<number, Partial<PRO_MODAL_TYPE>> = {
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
      this.fetchItems(params.itemId);
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
    this.itemsSelected = [...this.itemsSelected];
    this.refreshCounters(productIndex);
  }

  public onChangeItem(newItem: SelectedProduct, productIndex: number): void {
    const indexCart = this.itemsSelected.findIndex((itemSelected) => itemSelected.item.id === newItem.item.id);
    if (indexCart > -1) {
      this.itemsSelected[indexCart] = newItem;
    } else {
      this.itemsSelected.push(newItem);
    }
    this.itemsSelected = [...this.itemsSelected];
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

    modalRef.result.then(
      () => {
        this.reloadData();
      },
      () => {
        this.reloadData();
      }
    );

    if (errors.length === 1) {
      this.configSingleErrorModal(errors[0], modalRef);
      return;
    }
    this.configMultiErrorModal(errors, modalRef);
  }

  private reloadData(): void {
    this.getCreditInfo();
    this.itemsSelected = [];
    const id = this.route.snapshot.paramMap.get('itemId');
    this.fetchItems(id);
  }

  private fetchItems(itemId?: string): void {
    itemId ? this.getProductsFromParamsItem(itemId) : this.getProductsFromSelectedItems();
  }

  private configSingleErrorModal(error: BumpRequestSubject, modalRef: NgbModalRef): void {
    if (error.service === BUMP_SERVICE_TYPE.SUBSCRIPTION_BUMPS) {
      modalRef.componentInstance.modalConfig = this.getFreeBumpsModalConfig(error);
    }
    if (error.service === BUMP_SERVICE_TYPE.STRIPE) {
      modalRef.componentInstance.modalConfig = modalConfig[PRO_MODAL_TYPE.bump_error_stripe];
    }
  }

  private getFreeBumpsModalConfig(error: BumpRequestSubject): ProModalConfig {
    const errorCode = error.errorCode.toString();
    if (Object.keys(this.freeBumpsErrorMapper).includes(errorCode)) {
      return modalConfig[this.freeBumpsErrorMapper[errorCode]];
    }
    return modalConfig[PRO_MODAL_TYPE.bump_error_generic];
  }

  private configMultiErrorModal(errors: BumpRequestSubject[], modalRef: NgbModalRef): void {
    let errorModalConfig: ProModalConfig;
    errorModalConfig = modalConfig[PRO_MODAL_TYPE.bump_error_generic];
    errorModalConfig.text1 = modalConfig[PRO_MODAL_TYPE.bump_error_stripe].text1;
    errorModalConfig.text2 = this.getFreeBumpsModalConfig(errors[1]).text1;
    modalRef.componentInstance.modalConfig = errorModalConfig;
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
        creditInfo.currencyName = PACKS_TYPES.WALLACREDITS;
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
