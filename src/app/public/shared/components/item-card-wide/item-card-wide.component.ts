import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PERMISSIONS } from '@core/user/user-constants';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CAROUSEL_CONTROL_SIZE } from '@shared/components/carousel-slides/carousel-slides.component';

@Component({
  selector: 'tsl-item-card-wide',
  templateUrl: './item-card-wide.component.html',
  styleUrls: ['./item-card-wide.component.scss'],
})
export class ItemCardWideComponent {
  @Input() item: ItemCard;
  @Input() showFavourite = true;

  @Output() toggleFavourite: EventEmitter<{ item: ItemCard; loginSource: string }> = new EventEmitter<{
    item: ItemCard;
    loginSource: string;
  }>();

  public readonly PERMISSIONS = PERMISSIONS;
  public readonly carouselControlSize = CAROUSEL_CONTROL_SIZE.SMALL;

  constructor(public typeCheckService: TypeCheckService, public deviceDetectorService: DeviceDetectorService) {}

  public toggleItemFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleFavourite.emit({ item: this.item, loginSource: null });
  }
}
