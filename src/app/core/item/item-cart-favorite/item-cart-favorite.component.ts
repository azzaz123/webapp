import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Item, WindowRef } from 'shield';
import { ItemService } from '../item.service';
import { environment } from '../../../../environments/environment';
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
  private homeUrl: string

  constructor(private itemService: ItemService,
              private modalService: NgbModal,
              private windowRef: WindowRef,
              @Inject('SUBDOMAIN') private subdomain: string
  ) {
    this.homeUrl = environment.siteUrl.replace('es', this.subdomain);
  }

  ngOnInit() {
  }

  goToItemDetail() {
    this.windowRef.nativeWindow.location.href = this.homeUrl + 'item/' + this.item.webSlug;
  }

  removeFavoriteModal(e: Event) {
    e.stopPropagation();
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
