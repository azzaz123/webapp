import { Component, OnInit } from '@angular/core';
import { Item } from '../../../core/item/item';
import { ItemService } from '../../../core/item/item.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ItemBulkResponse } from '../../../core/item/item-response.interface';
import { EventService } from '../../../core/event/event.service';
import { ItemChangeEvent } from '../../list/catalog-item/item-change.interface';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';
import { UserService } from '../../../core/user/user.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { UserStatsResponse, Counters } from '../../../core/user/user-stats.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'tsl-catalog-pro-list',
  templateUrl: './catalog-pro-list.component.html',
  styleUrls: ['./catalog-pro-list.component.scss']
})
export class CatalogProListComponent implements OnInit {

  public items: Item[] = [];
  public scrollTop: number;
  public loading = true;
  public end: boolean;
  public isUrgent = false;
  public isRedirect = false;
  public orderBy: any[];
  public selectedStatus: string = 'active';
  public sortBy: string = 'date_desc';
  public counters: Counters;
  public subscriptionPlan: number;
  private term: string;
  private page: number = 1;
  private pageSize: number = 20;
  private active: boolean = true;
  private cache: boolean = true;

  constructor(public itemService: ItemService,
              private trackingService: TrackingService,
              private modalService: NgbModal,
              private eventService: EventService,
              private toastr: ToastrService,
              private i18n: I18nService,
              private userService: UserService,
              private errorService: ErrorsService,
              private router: Router) { }

  ngOnInit() {
    this.getCounters();
    let sorting: string[] = ['date_desc', 'date_asc', 'price_desc', 'price_asc'];
    this.orderBy = [];
    sorting.forEach((sort) => {
      this.orderBy.push({
        value: sort,
        label: this.i18n.getTranslations(sort)
      });
    });

    this.getItems();

    this.eventService.subscribe('itemChangeStatus', (items) => {
      items.forEach((id: string) => {
        let index: number = _.findIndex(this.items, {'id': id});
        this.items.splice(index, 1);
      });
    });
    this.isRedirect = !this.getRedirectToTPV();
  }

  public getItems(append?: boolean, openVisibility?: boolean) {
    this.loading = true;
    if (!append) {
      this.items = [];
    }
    this.itemService.mines(this.page, this.pageSize, this.sortBy, this.selectedStatus, this.term, this.cache).takeWhile(() => {
      this.cache = true;
      return this.active;
    }).subscribe((items: Item[]) => {
      if (this.selectedStatus === 'sold') {
        this.trackingService.track(TrackingService.PRODUCT_LIST_SOLD_VIEWED, {total_products: items.length});
      } else {
        this.trackingService.track(TrackingService.PRODUCT_LIST_ACTIVE_VIEWED, {total_products: items.length});
      }

      this.trackingService.track(TrackingService.PRODUCT_LIST_LOADED, {page_number: this.page});
      this.items = append ? this.items.concat(items) : items;
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.active = false;
  }

  public search(term: string) {
    this.term = term;
    this.page = 1;
    this.trackingService.track(TrackingService.PRODUCT_LIST_FILTERED_BY_TEXT, {filter: term, order_by: this.sortBy});
    this.getItems();
  }

  public sort(sortBy: string) {
    this.sortBy = sortBy;
    this.page = 1;
    this.trackingService.track(TrackingService.PRODUCT_LIST_ORDERED_BY, {filter: this.term, order_by: sortBy});
    this.getItems();
  }

  public filterByStatus(status: string) {
    this.selectedStatus = status;
    this.page = 1;
    this.getItems();
  }

  public loadMore() {
    this.page++;
    this.getItems(true);
  }

  public itemChanged($event: ItemChangeEvent) {
    let index: number = _.findIndex(this.items, {'_id': $event.item.id});
    this.items.splice(index, 1);
    this.getCounters();
  }

  public deselect() {
    this.itemService.deselectItems();
  }

  public delete(deleteItemsModal: any) {
    this.modalService.open(deleteItemsModal).result.then(() => {
      this.itemService.bulkDelete(this.selectedStatus).takeWhile(() => {
        return this.active;
      }).subscribe((response: ItemBulkResponse) => {
        this.getCounters();
        this.trackingService.track(TrackingService.PRODUCT_LIST_BULK_DELETED, {product_ids: response.updatedIds.join(', ')});
        response.updatedIds.forEach((id: string) => {
          let index: number = _.findIndex(this.items, {'id': id});
          this.items.splice(index, 1);
        });
        if (response.failedIds.length) {
          this.toastr.error(this.i18n.getTranslations('bulkDeleteError'));
        }
      });
    });
  }

  public getCounters() {
    this.userService.getStats().subscribe((userStats: UserStatsResponse) => {
      this.counters = userStats.counters;
    });
  }

  public getSubscriptionPlan(plan: number) {
    this.subscriptionPlan = plan;
  }

  /*public setSold(soldItemsModal: any) {
    this.modalService.open(soldItemsModal).result.then(() => {
      this.itemService.bulkSetSold().takeWhile(() => {
        return this.active;
      }).subscribe((response: ItemBulkResponse) => {
        this.trackingService.track(TrackingService.PRODUCT_LIST_BULK_SOLD, {product_ids: response.updatedIds.join(', ')});
        response.updatedIds.forEach((id: string) => {
          const index: number = _.findIndex(this.items, {'id': id});
          this.items.splice(index, 1);
        });
        if (response.failedIds.length) {
          this.toastr.error(this.i18n.getTranslations('bulkSoldError'));
        }
      });
    });
  }

  public reserve(reserveItemsModal: any) {
    this.modalService.open(reserveItemsModal).result.then(() => {
      this.itemService.bulkReserve().takeWhile(() => {
        return this.active;
      }).subscribe((response: ItemBulkResponse) => {
        this.trackingService.track(TrackingService.PRODUCT_LIST_BULK_RESERVED, {product_ids: response.updatedIds.join(', ')});
        if (response.failedIds.length) {
          this.toastr.error(this.i18n.getTranslations('bulkReserveError'));
        }
      });
    });
  }

  public deactivate(deactivateItemsModal: any) {
    this.modalService.open(deactivateItemsModal).result.then(() => {
      this.itemService.bulkSetDeactivate().takeWhile(() => {
        return this.active;
      }).subscribe(() => this.getCounters());
    });
  }

  public activate(activateItemsModal: any) {
    this.modalService.open(activateItemsModal).result.then(() => {
      this.itemService.bulkSetActivate().takeWhile(() => {
        return this.active;
      }).subscribe((resp: any) => {
        this.getCounters();
        if (resp.status === 406) {
          this.errorService.show(resp);
        }
      });
    });
  }*/

  private getRedirectToTPV(): boolean {
    return localStorage.getItem('redirectToTPV') === 'true';
  }

}
