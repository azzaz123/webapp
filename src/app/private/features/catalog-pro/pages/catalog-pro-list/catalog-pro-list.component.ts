import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ErrorsService } from '@core/errors/errors.service';
import { EventService } from '@core/event/event.service';
import { I18nService } from '@core/i18n/i18n.service';
import { Item } from '@core/item/item';
import { ITEM_STATUS, ItemService } from '@core/item/item.service';
import { Pack } from '@core/payments/pack';
import { FinancialCard, Packs } from '@core/payments/payment.interface';
import { PerksModel } from '@core/payments/payment.model';
import { PaymentService } from '@core/payments/payment.service';
import { Counters, UserStats } from '@core/user/user-stats.interface';
import { UserService } from '@core/user/user.service';
import { UuidService } from '@core/uuid/uuid.service';
import { CreditCardModalComponent } from '@private/features/catalog-pro/modals/credit-card-modal/credit-card-modal.component';
import { ProBumpConfirmationModalComponent } from '@private/features/catalog-pro/modals/pro-bump-confirmation-modal/pro-bump-confirmation-modal.component';
import { OrderEvent } from '@private/features/catalog/components/selected-items/selected-product.interface';
import { ITEM_CHANGE_ACTION, ItemChangeEvent } from '@private/features/catalog/core/item-change.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BumpSuggestionModalComponent } from '@shared/modals/bump-suggestion-modal/bump-suggestion-modal.component';
import { ItemSoldDirective } from '@shared/modals/sold-modal/item-sold.directive';
import { findIndex } from 'lodash-es';
import { takeWhile } from 'rxjs/operators';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { PRO_PATHS } from '@private/features/pro/pro-routing-constants';

export const SORTS = ['date_desc', 'date_asc', 'price_desc', 'price_asc'];
export const SORTS_TRANSLATION_KEYS: TRANSLATION_KEY[] = [
  TRANSLATION_KEY.DATE_DESC,
  TRANSLATION_KEY.DATE_ASC,
  TRANSLATION_KEY.PRICE_DESC,
  TRANSLATION_KEY.PRICE_ASC,
];
export const CONTACT_MOTOR_TOAST_TEXT = $localize`:@@web_toast_cardealer_error_contact:According to your plan you cannot activate more items. Contact ventas.motor@wallapop.com if you want to increase your plan or deactivate other items in order to activate this one.!`;

@Component({
  selector: 'tsl-catalog-pro-list',
  templateUrl: './catalog-pro-list.component.html',
  styleUrls: ['./catalog-pro-list.component.scss'],
})
export class CatalogProListComponent implements OnInit, OnDestroy {
  @ViewChild(ItemSoldDirective, { static: true }) soldButton: ItemSoldDirective;
  public items: Item[] = [];
  public loading = true;
  public end: boolean;
  public orderBy: any[];
  public selectedStatus: string = ITEM_STATUS.ACTIVE;
  public sortBy = 'date_desc';
  public counters: Counters;
  public active = true;
  public numberOfProducts: number;
  public _subscriptionPlan: number;
  public readonly PRO_PATHS = PRO_PATHS;
  private term: string;
  private page = 1;
  private pageSize = 20;
  private cache = false;
  private bumpSuggestionModalRef: NgbModalRef;

  constructor(
    public itemService: ItemService,
    private modalService: NgbModal,
    private eventService: EventService,
    private i18n: I18nService,
    private userService: UserService,
    private errorService: ErrorsService,
    private router: Router,
    private uuidService: UuidService,
    private route: ActivatedRoute,
    private paymentService: PaymentService
  ) {}

  set subscriptionPlan(plan: number) {
    this._subscriptionPlan = plan;
  }

  get subscriptionPlan(): number {
    return this._subscriptionPlan;
  }

  ngOnInit() {
    this.getCounters();
    this.getItems();
    // TODO: Use the same sorts from list.component
    this.orderBy = SORTS.map((value, i) => {
      return { value, label: this.i18n.translate(SORTS_TRANSLATION_KEYS[i]) };
    });

    this.eventService.subscribe('itemChangeStatus', (items) => {
      items.forEach((id: string) => {
        const index: number = findIndex(this.items, { id: id });
        this.items.splice(index, 1);
      });
    });

    setTimeout(() => {
      this.router.events.pipe(takeWhile(() => this.active)).subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
          return;
        }
        this.end = false;
        this.getItems();
      });
      this.route.params.subscribe((params: any) => {
        if (params && params.code) {
          this.cache = false;
          this.getItems();
          const modals = {
            bump: {
              component: ProBumpConfirmationModalComponent,
              windowClass: 'bump-confirm',
            },
          };
          const modalType = localStorage.getItem('transactionType');
          const modal = modalType && modals[modalType] ? modals[modalType] : modals.bump;

          let modalRef: NgbModalRef = this.modalService.open(modal.component, {
            windowClass: modal.windowClass,
            backdrop: 'static',
          });
          modalRef.componentInstance.code = params.code;
          if (params.extras) {
            modalRef.componentInstance.extras = params.extras;
          }
          modalRef.result.then(
            () => {
              modalRef = null;
              localStorage.removeItem('transactionType');
              if (params.code === '202') {
                this.router.navigate(['pro/catalog/checkout-extras']);
              } else {
                this.router.navigate(['pro/catalog/list']);
              }
            },
            () => {}
          );
        }
        if (params && params.created) {
          this.showBumpSuggestionModal(params.itemId);
          this.cache = false;
          this.getItems();
        } else if (params && params.updated) {
          this.cache = false;
          if (params.onHold) {
            this.selectedStatus = ITEM_STATUS.PENDING;
          }
          this.getItems();
          this.errorService.i18nSuccess(TRANSLATION_KEY.ITEM_UPDATED);
        } else if (params && params.createdOnHold) {
          this.errorService.i18nError(TRANSLATION_KEY.PRODUCT_CREATED, CONTACT_MOTOR_TOAST_TEXT);
        } else if (params && params.sold && params.itemId) {
          this.itemService.get(params.itemId).subscribe((item: Item) => {
            this.soldButton.item = item;
            this.soldButton.onClick();
            this.soldButton.callback.subscribe(() => {
              this.eventService.emit('itemChanged');
              this.itemChanged({
                item: item,
                action: ITEM_CHANGE_ACTION.SOLD,
              });
              this.eventService.emit(EventService.ITEM_SOLD, item);
            });
          });
        } else if (params && params.alreadyFeatured) {
          this.errorService.i18nError(TRANSLATION_KEY.ALREADY_FEATURED_ERROR);
        }
      });
    });
  }

  public getItems(append?: boolean) {
    this.loading = true;
    if (!append) {
      this.items = [];
    }
    this.itemService
      .mines(this.page, this.pageSize, this.sortBy, this.selectedStatus, this.term, this.cache)
      .pipe(
        takeWhile(() => {
          this.cache = true;
          return this.active;
        })
      )
      .subscribe((items: Item[]) => {
        this.items = append ? this.items.concat(items) : items;
        this.loading = false;
        if (this.bumpSuggestionModalRef) {
          this.bumpSuggestionModalRef.componentInstance.item = this.items[0];
        }
      });
  }

  ngOnDestroy() {
    this.active = false;
  }

  public search(term: string) {
    this.term = term;
    this.page = 1;
    this.getItems();
  }

  public sort(sortBy: string) {
    this.sortBy = sortBy;
    this.page = 1;
    this.getItems();
  }

  public filterByStatus(status: string) {
    this.selectedStatus = status;
    this.itemService.deselectItems();
    this.page = 1;
    this.cache = false;
    this.getItems();
    this.getNumberOfProducts();
  }

  public loadMore() {
    this.page++;
    this.getItems(true);
  }

  public itemChanged($event: ItemChangeEvent) {
    const index: number = findIndex(this.items, { _id: $event.item.id });
    this.items.splice(index, 1);
    this.cache = false;
    this.page = 1;
    this.getCounters();
    this.getItems();
  }

  public bumpCancelled($event: ItemChangeEvent) {
    const index: number = findIndex(this.items, { _id: $event.item.id });
    this.items[index].purchases = null;
    this.cache = false;
    this.page = 1;
    this.getCounters();
    this.getItems();
  }

  public deselect() {
    this.itemService.deselectItems();
  }

  public feature(orderEvent: OrderEvent) {
    const orderId: string = this.uuidService.getUUID();
    this.itemService.purchaseProducts(orderEvent.order, orderId).subscribe(
      (failedProducts: string[]) => {
        if (failedProducts && failedProducts.length) {
          this.errorService.i18nError(TRANSLATION_KEY.BUMP_ERROR);
        } else {
          this.chooseCreditCard(orderId, orderEvent.total);
        }
      },
      () => {
        this.deselect();
      }
    );
  }

  public getNumberOfProducts() {
    this.userService.getStats().subscribe((userStats: UserStats) => {
      this.counters = userStats.counters;
      this.setNumberOfProducts();
    });
  }

  public getCounters() {
    this.userService.getStats().subscribe((userStats: UserStats) => {
      this.counters = userStats.counters;
    });
  }

  public onSetSubscriptionPlan(plan: number): void {
    this.subscriptionPlan = plan;
  }

  private chooseCreditCard(orderId: string, total: number, financialCard?: FinancialCard) {
    const modalRef: NgbModalRef = this.modalService.open(CreditCardModalComponent, { windowClass: 'credit-card' });
    modalRef.componentInstance.financialCard = financialCard;
    modalRef.componentInstance.total = total;
    modalRef.componentInstance.orderId = orderId;
    modalRef.result.then(
      (result: string) => {
        if (result === undefined) {
          localStorage.removeItem('transactionType');
          this.deselect();
          setTimeout(() => {
            this.router.navigate(['catalog/list']);
          }, 1000);
        } else {
          const code = result === 'success' ? 200 : -1;
          this.deselect();
          setTimeout(() => {
            this.router.navigate(['catalog/list', { code }]);
          }, 1000);
        }
      },
      () => {
        this.deselect();
      }
    );
  }

  private setNumberOfProducts() {
    if (this.selectedStatus === ITEM_STATUS.SOLD) {
      this.numberOfProducts = this.counters.sold;
    } else if (this.selectedStatus === ITEM_STATUS.PUBLISHED) {
      this.numberOfProducts = this.counters.publish;
    }
  }

  private showBumpSuggestionModal(itemId: string): void {
    this.bumpSuggestionModalRef = this.modalService.open(BumpSuggestionModalComponent, {
      windowClass: 'modal-standard',
    });
    this.getBumpSuggestionModalPrice(this.bumpSuggestionModalRef);
    this.bumpSuggestionModalRef.result.then((result: { redirect: boolean; hasPrice?: boolean }) => {
      this.bumpSuggestionModalRef = null;
      if (result?.redirect) {
        if (result.hasPrice) {
          this.router.navigate(['pro/catalog/checkout-extras']);
        } else {
          this.router.navigate(['pro/catalog/checkout', { itemId }]);
        }
      }
    });
  }

  private getBumpSuggestionModalPrice(modalRef: NgbModalRef): void {
    this.paymentService.getPerks(true).subscribe((perks: PerksModel) => {
      if (perks.getBumpCounter() === 0 && perks.getNationalBumpCounter() === 0) {
        this.paymentService.getPacks().subscribe((packs: Packs) => {
          let minValue: Pack = null;
          const allowed = ['cityBump', 'countryBump'];

          const filtered = Object.keys(packs)
            .filter((key) => allowed.includes(key))
            .reduce((obj, key) => {
              obj[key] = packs[key].reduce((prev, curr) => (+prev.price < +curr.price ? prev : curr));
              return obj;
            }, {});

          for (const property in filtered) {
            if (minValue) {
              minValue = +minValue.price > +filtered[property].price ? filtered[property] : minValue;
            } else {
              minValue = filtered[property];
            }
          }
          modalRef.componentInstance.productPrice = +minValue.price;
          modalRef.componentInstance.productCurrency = minValue.currency;
        });
      }
    });
  }
}
