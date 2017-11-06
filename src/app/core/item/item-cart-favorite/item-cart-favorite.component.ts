import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Item } from 'shield';
import { ItemService } from '../../../core/item/item.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'tsl-item-cart-favorite',
  templateUrl: './item-cart-favorite.component.html',
  styleUrls: ['./item-cart-favorite.component.scss']
})
export class ItemCartFavoriteComponent implements OnInit {

  @Input() item: Item;
  @Output() onFavoriteChange: EventEmitter<Item> = new EventEmitter();

  constructor(public itemService: ItemService,
              private modalService: NgbModal
  ) {
  }

  ngOnInit() {
  }

  removeFavoriteModal() {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.type = 3;
    modalRef.result.then(() => {
      this.removeFavorite();
    }, () => {});
  }

  removeFavorite() {
    this.itemService.favoriteItem(this.item.id, false).subscribe(() => {
      this.item.favorited = false;
      this.onFavoriteChange.emit(this.item);
    });
  }

}
