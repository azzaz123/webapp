import { Component, Input, Renderer2 } from '@angular/core';
import { Item } from '@core/item/item';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'tsl-item-fullscreen-carousel',
  templateUrl: './item-fullscreen-carousel.component.html',
  styleUrls: ['./item-fullscreen-carousel.component.scss'],
})
export class ItemFullScreenCarouselComponent {
  public hidden = true;
  @Input() item: Item;
  @Input() images: string[];
  @Input() imageIndex: number = 0;

  constructor(
    public deviceDetectorService: DeviceDetectorService,
    private checkSessionService: CheckSessionService,
    private itemCardService: ItemCardService,
    private renderer: Renderer2
  ) {}

  public show(): void {
    this.hidden = false;
    window.scrollTo(0, 0);
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
