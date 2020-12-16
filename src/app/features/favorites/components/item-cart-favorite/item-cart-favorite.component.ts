import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ItemService } from '@core/item/item.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { TrackingService } from '@core/tracking/tracking.service';
import { Item } from '@core/item/item';
import { Router, RouteReuseStrategy } from '@angular/router';

@Component({
  selector: 'tsl-item-cart-favorite',
  templateUrl: './item-cart-favorite.component.html',
  styleUrls: ['./item-cart-favorite.component.scss'],
})
export class ItemCartFavoriteComponent implements OnInit {
  @Input() item: Item;
  @Output() onFavoriteChange: EventEmitter<Item> = new EventEmitter();

  constructor(
    private itemService: ItemService,
    private modalService: NgbModal,
    private trackingService: TrackingService,
    @Inject('SUBDOMAIN') private subdomain: string
  ) {}

  ngOnInit() {}

  goToItemDetail() {
    const url = this.item.getUrl(this.subdomain);
    window.open(url);
  }

  removeFavoriteModal(e: Event) {
    e.stopPropagation();
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      windowClass: 'modal-prompt',
    });
    modalRef.componentInstance.type = 3;
    modalRef.result.then(
      () => {
        this.removeFavorite();
      },
      () => {}
    );
  }

  removeFavorite() {
    this.itemService.favoriteItem(this.item.id, false).subscribe(() => {
      this.item.favorited = false;
      this.onFavoriteChange.emit(this.item);
      this.trackingService.track(TrackingService.FAVOURITES_BUTTON_UNFAVORITE);
    });
  }
}
