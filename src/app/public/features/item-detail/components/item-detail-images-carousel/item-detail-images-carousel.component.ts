import { Component, Input, Renderer2 } from '@angular/core';
import { Item } from '@core/item/item';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';

@Component({
  selector: 'tsl-item-detail-images-carousel',
  templateUrl: './item-detail-images-carousel.component.html',
  styleUrls: ['./item-detail-images-carousel.component.scss'],
})
export class ItemDetailImagesCarouselComponent {
  public hidden = true;
  @Input() item: Item;
  @Input() images: string[];
  @Input() imageIndex: number = 0;

  constructor(private checkSessionService: CheckSessionService, private itemCardService: ItemCardService, private renderer: Renderer2) {}

  public show(): void {
    this.hidden = false;
    this.renderer.addClass(document.body, 'blocked-page');
  }

  public hidde(): void {
    this.hidden = true;
    this.renderer.removeClass(document.body, 'blocked-page');
  }

  public toggleItemFavorite(): void {
    this.checkSessionService.hasSession() ? this.itemCardService.toggleFavourite(this.item) : this.checkSessionService.checkSessionAction();
  }
}
