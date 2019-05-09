import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ItemService } from '../../core/item/item.service';
import { ItemChangeEvent } from './catalog-item/item-change.interface';
import * as _ from 'lodash';
import {
  ItemBulkResponse, ItemsData, Order, Product,
  SelectedItemsAction
} from '../../core/item/item-response.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { BumpConfirmationModalComponent } from './modals/bump-confirmation-modal/bump-confirmation-modal.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { OrderEvent } from './selected-items/selected-product.interface';
import { UploadConfirmationModalComponent } from './modals/upload-confirmation-modal/upload-confirmation-modal.component';
import { TrackingService } from '../../core/tracking/tracking.service';
import { ErrorsService } from '../../core/errors/errors.service';
import { UserService } from '../../core/user/user.service';
import { AvailableSlots, Counters, UserStatsResponse } from '../../core/user/user-stats.interface';
import { BumpTutorialComponent } from '../checkout/bump-tutorial/bump-tutorial.component';
import { Item } from '../../core/item/item';
import { PaymentService } from '../../core/payments/payment.service';
import { UrgentConfirmationModalComponent } from './modals/urgent-confirmation-modal/urgent-confirmation-modal.component';
import { EventService } from '../../core/event/event.service';
import { ItemSoldDirective } from '../../shared/modals/sold-modal/item-sold.directive';
import { BuyProductModalComponent } from './modals/buy-product-modal/buy-product-modal.component';
import { ReactivateConfirmationModalComponent } from './modals/reactivate-confirmation-modal/reactivate-confirmation-modal.component';
import { MotorPlan, MotorPlanType } from '../../core/user/user-response.interface';
import { I18nService } from '../../core/i18n/i18n.service';
import { UpgradePlanModalComponent } from './modals/upgrade-plan-modal/upgrade-plan-modal.component';
import { TooManyItemsModalComponent } from '../../shared/catalog/modals/too-many-items-modal/too-many-items-modal.component';
import { ActivateItemsModalComponent } from '../../shared/catalog/catalog-item-actions/activate-items-modal/activate-items-modal.component';
import { DeactivateItemsModalComponent } from '../../shared/catalog/catalog-item-actions/deactivate-items-modal/deactivate-items-modal.component';
import { ListingfeeConfirmationModalComponent } from './modals/listingfee-confirmation-modal/listingfee-confirmation-modal.component';

const TRANSACTIONS_WITH_CREDITS = ['bumpWithCredits', 'urgentWithCredits', 'reactivateWithCredits', 'purchaseListingFeeWithCredits'];

@Component({
  selector: 'tsl-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  public items: Item[] = [];
  public selectedStatus = 'published';
  public loading = true;
  private init = 0;
  public end: boolean;
  public sabadellSubmit: EventEmitter<string> = new EventEmitter();
  public scrollTop: number;
  private uploadModalRef: NgbModalRef;
  private active = true;
  private firstItemLoad = true;
  public isUrgent = false;
  public numberOfProducts: number;
  public isRedirect = false;
  private counters: Counters;
  public motorPlan: MotorPlanType;
  private upgradePlanModalRef: NgbModalRef;
  public hasMotorPlan: boolean;
  public carsLimit: number = 0;
  public userCanDeactivate: boolean;
  public availableSlots: number = 0;
  public selectedItems: Item[];

  @ViewChild(ItemSoldDirective) soldButton: ItemSoldDirective;
  @ViewChild(BumpTutorialComponent) bumpTutorial: BumpTutorialComponent;

  constructor(public itemService: ItemService,
    private trackingService: TrackingService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private errorService: ErrorsService,
    private router: Router,
    public userService: UserService,
    private eventService: EventService,
    protected i18n: I18nService) {
  }

  ngOnInit() {
    this.userService.getMotorPlan().subscribe((motorPlan: MotorPlan) => {
      if (motorPlan) {
        const motorPlanTypes = this.i18n.getTranslations('motorPlanTypes');
        this.motorPlan = motorPlanTypes.filter((p: MotorPlanType) => p.subtype === motorPlan.subtype)[0];
        this.hasMotorPlan = motorPlan.type === 'motor_plan_pro';
        if (this.hasMotorPlan) {
          this.selectedStatus = 'cars';
          this.carsLimit = motorPlan.limit;
        }
      }
      this.getItems();
      this.getNumberOfProducts();
    });

    this.itemService.selectedItems$.takeWhile(() => {
      return this.active;
    }).subscribe((action: SelectedItemsAction) => {
      this.selectedItems = this.itemService.selectedItems.map((id: string) => {
        return <Item>_.find(this.items, {id: id});
      });
    });

    setTimeout(() => {
      this.router.events.takeWhile(() => this.active).subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        this.scrollTop = 0;
        this.init = 0;
        this.end = false;
        this.getItems();
      });
      this.route.params.subscribe((params: any) => {
        if (!params.urgent) {
          this.setRedirectToTPV(false);
        }
        if (params && params.code) {
          const modals = {
            urgent: UrgentConfirmationModalComponent,
            bump: BumpConfirmationModalComponent,
            reactivate: ReactivateConfirmationModalComponent,
            listingfee: ListingfeeConfirmationModalComponent
          };
          const transactionType = localStorage.getItem('transactionType');
          let modalType;
          let modal;

          switch (transactionType) {
            case 'urgentWithCredits':
              modalType = 'urgent';
              break;
            case 'reactivateWithCredits':
              modalType = 'reactivate';
              break;
            case 'wallapack':
              this.router.navigate(['wallacoins', { code: params.code }]);
              return;
            case 'purchaseListingFee':
            case 'purchaseListingFeeWithCredits':
              modalType = 'listingfee';
              break;
            default:
              modalType = transactionType;
          }

          if (params.code === '-1') {
            modal = modals.bump;
          } else {
            modal = modalType && modals[modalType] ? modals[modalType] : modals.bump;
          }

          let modalRef: NgbModalRef = this.modalService.open(modal, {
            windowClass: 'modal-standard',
            backdrop: 'static'
          });
          modalRef.componentInstance.code = params.code;
          modalRef.componentInstance.creditUsed = TRANSACTIONS_WITH_CREDITS.includes(transactionType);
          modalRef.componentInstance.spent = localStorage.getItem('transactionSpent');
          modalRef.result.then(() => {
            modalRef = null;
            localStorage.removeItem('transactionType');
            localStorage.removeItem('transactionSpent');
            this.router.navigate(['catalog/list']);
          }, () => {
            modalRef = null;
            localStorage.removeItem('transactionType');
            localStorage.removeItem('transactionSpent');
            this.router.navigate(['wallacoins']);
          });
        }
        if (params && params.created) {
          this.uploadModalRef = this.modalService.open(UploadConfirmationModalComponent, {
            windowClass: 'modal-standard',
          });
          this.uploadModalRef.result.then((orderEvent: OrderEvent) => {
            this.uploadModalRef = null;
            if (orderEvent) {
              this.isUrgent = true;
              this.isRedirect = !this.getRedirectToTPV();
              this.feature(orderEvent, 'urgent');
            }
          }, () => {
          });
        } else if (params && params.urgent) {
          this.isUrgent = true;
          this.isRedirect = !this.getRedirectToTPV();
          if (!this.getRedirectToTPV()) {
            setTimeout(() => {
              this.getUrgentPrice(params.itemId);
            }, 3000);
          }
        } else if (params && params.updated) {
          this.errorService.i18nSuccess('itemUpdated');
        } else if (params && params.createdOnHold) {
          this.upgradePlanModalRef = this.modalService.open(UpgradePlanModalComponent, {
            windowClass: 'modal-standard',
          });
          this.upgradePlanModalRef.componentInstance.itemId = params.itemId;
          this.upgradePlanModalRef.result.then((orderEvent: OrderEvent) => {
            if (orderEvent) {
              this.purchaseListingFee(orderEvent);
            } else {
              this.upgradePlanModalRef = null;
            }
          }, () => {
          });
        } else if (params && params.sold && params.itemId) {
          this.itemService.get(params.itemId).subscribe((item: Item) => {
            this.soldButton.item = item;
            this.soldButton.onClick();
            this.soldButton.callback.subscribe(() => {
              this.itemChanged({
                item: item,
                action: 'sold'
              });
              this.eventService.emit(EventService.ITEM_SOLD, item);
            });
          });
        } else if (params && params.alreadyFeatured) {
          this.errorService.i18nError('alreadyFeatured');
        }
      });
    });
  }

  private restoreSelectedItems() {
    this.itemService.selectedItems.forEach((itemId: string) => {
      this.itemService.selectedItems$.next({
        id: itemId,
        action: 'selected'
      });
    });
  }

  ngOnDestroy() {
    this.active = false;
  }

  public filterByStatus(status: string) {
    this.deselect();
    if (status !== this.selectedStatus) {
      this.selectedStatus = status;
      this.init = 0;
      this.getItems();
      this.getNumberOfProducts();
    }
  }

  public loadMore() {
    this.getItems(true);
  }

  private getItems(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.items = [];
    }
    let status = this.selectedStatus;
    if (this.hasMotorPlan) {
      if (this.selectedStatus === 'cars') {
        status = 'published/cars';
      } else if (this.selectedStatus === 'published') {
        status = 'published/notCars';
      }
    }
    this.itemService.mine(this.init, status).subscribe((itemsData: ItemsData) => {
      const items = itemsData.data;
      if (this.selectedStatus === 'sold') {
        this.trackingService.track(TrackingService.PRODUCT_LIST_SOLD_VIEWED, { total_products: items.length });
      } else if (this.selectedStatus === 'published') {
        this.trackingService.track(TrackingService.PRODUCT_LIST_ACTIVE_VIEWED, { total_products: items.length });
      }
      this.trackingService.track(TrackingService.PRODUCT_LIST_LOADED, { init: this.init });
      this.init = itemsData.init;
      this.items = append ? this.items.concat(items) : items;
      this.loading = false;
      this.end = !this.init;
      if (this.uploadModalRef) {
        this.uploadModalRef.componentInstance.item = this.items[0];
        this.uploadModalRef.componentInstance.trackUploaded();
        this.uploadModalRef.componentInstance.urgentPrice();
      }
      if (this.firstItemLoad) {
        setTimeout(() => {
          this.restoreSelectedItems();
        });
      }
      this.firstItemLoad = false;
    });
  }

  public itemChanged($event: ItemChangeEvent) {
    if ($event.action === 'reactivatedWithBump') {
      localStorage.setItem('transactionType', 'reactivate');
      this.feature($event.orderEvent, 'reactivate');
    } else if ($event.action === 'reactivated') {
      const index: number = _.findIndex(this.items, { '_id': $event.item.id });
      this.items[index].flags.expired = false;
    } else {
      const index: number = _.findIndex(this.items, { '_id': $event.item.id });
      this.items.splice(index, 1);
      this.getNumberOfProducts();
    }
  }

  public deselect() {
    this.itemService.deselectItems();
    this.items.map((item: Item) => {
      item.selected = false;
    });
    this.itemService.selectedAction = null;
  }

  public onAction($event?: any) {
    if (this.itemService.selectedAction === 'delete') {
      this.delete();
    } else if (this.itemService.selectedAction === 'reserve') {
      this.reserve();
    }
  }

  public delete() {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, {
      windowClass: 'modal-prompt'
    });
    modalRef.componentInstance.type = 1;
    modalRef.result.then(() => {
      this.itemService.bulkDelete('active').subscribe((response: ItemBulkResponse) => {
        this.trackingService.track(TrackingService.PRODUCT_LIST_BULK_DELETED, { product_ids: response.updatedIds.join(', ') });
        response.updatedIds.forEach((id: string) => {
          const index: number = _.findIndex(this.items, { 'id': id });
          this.items.splice(index, 1);
        });
        if (response.failedIds.length) {
          this.errorService.i18nError('bulkDeleteError');
        } else {
          this.getNumberOfProducts();
        }
      });
    }, () => {
    });
  }

  public reserve() {
    this.itemService.bulkReserve().subscribe((response: ItemBulkResponse) => {
      this.deselect();
      this.trackingService.track(TrackingService.PRODUCT_LIST_BULK_RESERVED, { product_ids: response.updatedIds.join(', ') });
      response.updatedIds.forEach((id: string) => {
        const index: number = _.findIndex(this.items, { 'id': id });
        if (this.items[index]) {
          this.items[index].reserved = true;
          this.eventService.emit(EventService.ITEM_RESERVED, this.items[index]);
        }
      });
      if (response.failedIds.length) {
        this.errorService.i18nError('bulkReserveError');
      }
    });
  }

  public feature(orderEvent: OrderEvent, type?: string) {
    const modalRef: NgbModalRef = this.modalService.open(BuyProductModalComponent, { windowClass: 'modal-standard' });
    modalRef.componentInstance.type = type;
    modalRef.componentInstance.orderEvent = orderEvent;
    modalRef.result.then((result: string) => {
      this.isUrgent = false;
      this.setRedirectToTPV(false);
      if (result === 'success') {
        this.router.navigate(['catalog/list', { code: 200 }]);
      } else {
        this.router.navigate(['catalog/list', { code: -1 }]);
      }
    }, () => {
      this.isUrgent = false;
      this.setRedirectToTPV(false);
    });
  }

  public getNumberOfProducts() {
    this.userService.getStats().subscribe((userStats: UserStatsResponse) => {
      this.counters = userStats.counters;
      this.setNumberOfProducts();
    });
    if (this.hasMotorPlan) {
      this.userService.getAvailableSlots().subscribe((slots: AvailableSlots) => {
        this.availableSlots = slots.num_slots_cars;
        this.userCanDeactivate = slots.user_can_manage;
      });
    }
  }

  public get totalCars(): number {
    return this.carsLimit - this.availableSlots;
  }

  public purchaseListingFee(orderEvent: OrderEvent) {
    const modalRef: NgbModalRef = this.modalService.open(BuyProductModalComponent, { windowClass: 'modal-standard' });
    modalRef.componentInstance.type = 'listing-fee';
    modalRef.componentInstance.orderEvent = orderEvent;
    localStorage.setItem('transactionType', 'purchaseListingFee');
    modalRef.result.then((result: string) => {
      this.setRedirectToTPV(false);
      if (result === 'success') {
        this.router.navigate(['catalog/list', { code: 200 }]);
      } else {
        this.router.navigate(['catalog/list', { code: -1 }]);
      }
    }, () => {
      this.setRedirectToTPV(false);
    });
  }

  private setNumberOfProducts() {
    if (this.selectedStatus === 'sold') {
      this.numberOfProducts = this.counters.sold;
    } else if (this.selectedStatus === 'published') {
      this.numberOfProducts = this.counters.publish;
    }
  }

  private getUrgentPrice(itemId: string): void {
    this.itemService.getUrgentProducts(itemId).subscribe((product: Product) => {
      const order: Order[] = [{
        item_id: itemId,
        product_id: product.durations[0].id
      }];
      const orderEvent: OrderEvent = {
        order: order,
        total: +product.durations[0].market_code
      };
      this.feature(orderEvent, 'urgent');
    });
  }

  private setRedirectToTPV(state: boolean): void {
    localStorage.setItem('redirectToTPV', state.toString());
    this.isRedirect = state;
  }

  private getRedirectToTPV(): boolean {
    return localStorage.getItem('redirectToTPV') === 'true';
  }

  public deactivate() {
    const items = this.itemService.selectedItems;
    this.modalService.open(DeactivateItemsModalComponent).result.then(() => {
      this.itemService.deactivate().subscribe(() => {
        items.forEach((id: string) => {
          let item: Item = _.find(this.items, {'id': id});
          item.flags['onhold'] = true;
          item.selected = false;
        });
        this.getNumberOfProducts();
        this.eventService.emit('itemChanged');
      });
    });
  }

  public activate() {
    const items = this.itemService.selectedItems;
    this.modalService.open(ActivateItemsModalComponent).result.then(() => {
      this.itemService.activate().subscribe((resp: any) => {
        items.forEach((id: string) => {
          let item: Item = _.find(this.items, {'id': id});
          item.flags['onhold'] = false;
          item.selected = false;
        });
        this.getNumberOfProducts();
        this.eventService.emit('itemChanged');
      }, () => {
        this.modalService.open(TooManyItemsModalComponent, {windowClass: 'bump'})
          .result.then(() => {}, () => {});
      });
    });
  }

  public get canActivate(): boolean {
    return _.every(this.selectedItems, (item) => {
      return item.flags && item.flags.onhold;
    });
  }

  public get canDeactivate(): boolean {
    return _.every(this.selectedItems, (item) => {
      return item.flags && !item.flags.onhold;
    });
  }

}
