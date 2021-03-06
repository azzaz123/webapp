import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemService } from '@core/item/item.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import { Item } from '@core/item/item';
import { I18nService } from '@core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { COLORS } from '@core/colors/colors-constants';
import { FavouritesListTrackingEventsService } from '../../services/favourites-list-tracking-events.service';

@Component({
  selector: 'tsl-item-card-favourite',
  templateUrl: './item-card-favourite.component.html',
  styleUrls: ['./item-card-favourite.component.scss'],
})
export class ItemCardFavouriteComponent {
  @Input() item: Item;
  @Output() favoriteChange: EventEmitter<Item> = new EventEmitter();

  constructor(
    private itemService: ItemService,
    private modalService: NgbModal,
    private i18nService: I18nService,
    private favouritesListTrackingEventsService: FavouritesListTrackingEventsService
  ) {}

  removeFavoriteModal(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    const modalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.properties = {
      title: this.i18nService.translate(TRANSLATION_KEY.REMOVE_ITEM_FROM_FAVORITES_TITLE),
      description: this.i18nService.translate(TRANSLATION_KEY.REMOVE_ITEM_FROM_FAVORITES_DESCRIPTION),
      confirmMessage: this.i18nService.translate(TRANSLATION_KEY.REMOVE_BUTTON),
      confirmColor: COLORS.NEGATIVE_MAIN,
    };

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
      this.favouritesListTrackingEventsService.trackUnfavouriteItemEvent(this.item);
      this.favoriteChange.emit(this.item);
    });
  }
}
