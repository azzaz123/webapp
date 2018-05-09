import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemService } from '../../../core/item/item.service';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ItemBulkResponse } from '../../../core/item/item-response.interface';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from '../../../core/item/item';
import * as _ from 'lodash';

@Component({
  selector:    'tsl-catalog-item-actions',
  templateUrl: './catalog-item-actions.component.html',
  styleUrls:   ['./catalog-item-actions.component.scss']
})
export class CatalogItemActionsComponent implements OnInit {

  @Input() selectedStatus: string;
  @Input() items: Item[];
  @Input() active: boolean;
  @Output() public getCounters: EventEmitter<any> = new EventEmitter();

  constructor(public itemService: ItemService,
              private trackingService: TrackingService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private i18n: I18nService,
              private errorService: ErrorsService) {
  }

  ngOnInit() {
  }
  
  public deactivate(deactivateItemsModal: any) {
    this.modalService.open(deactivateItemsModal).result.then(() => {
      this.itemService.bulkSetDeactivate().takeWhile(() => {
        return this.active;
      }).subscribe(() => this.getCounters.emit());
    });
  }

  public activate(activateItemsModal: any) {
    this.modalService.open(activateItemsModal).result.then(() => {
      this.itemService.bulkSetActivate().takeWhile(() => {
        return this.active;
      }).subscribe((resp: any) => {
        this.getCounters.emit();
        if (resp.status === 406) {
          this.errorService.show(resp);
        }
      });
    });
  }

  public delete(deleteItemsModal: any) {
    this.modalService.open(deleteItemsModal).result.then(() => {
      this.itemService.bulkDelete(this.selectedStatus).takeWhile(() => {
        return this.active;
      }).subscribe((response: ItemBulkResponse) => {
        this.getCounters.emit();
        //this.trackingService.track(TrackingService.PRODUCT_LIST_BULK_DELETED, {product_ids: response.updatedIds.join(', ')});
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

  public deselect() {
    this.itemService.deselectItems();
  }

}
