import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { ItemService } from '../../../core/item/item.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TrackingService } from '../../../core/tracking/tracking.service';
import { ErrorsService } from '../../../core/errors/errors.service';
import { Item } from '../../../core/item/item';
import { SoldModalComponent } from './sold-modal.component';
import { InboxItem } from '../../../chat/model/inbox-item';

@Directive({
  selector: '[tslItemSold]',
})
export class ItemSoldDirective {
  @Input() item: Item | InboxItem;
  @Output() callback = new EventEmitter();

  constructor(
    private itemService: ItemService,
    private modalService: NgbModal,
    private errorsService: ErrorsService
  ) {}

  @HostListener('click') onClick() {
    this.itemService
      .canDoAction('mark_sold', this.item.id)
      .subscribe((canMarkAsSold: boolean) => {
        if (canMarkAsSold) {
          const modalRef: NgbModalRef = this.modalService.open(
            SoldModalComponent,
            {
              windowClass: 'sold',
            }
          );
          modalRef.componentInstance.item = this.item;
          modalRef.result.then(
            () => {
              this.item.sold = true;
              this.callback.emit();
            },
            () => {}
          );
        } else {
          this.errorsService.i18nError('cantEditError');
        }
      });
  }
}
