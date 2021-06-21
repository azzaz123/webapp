import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PERMISSIONS } from '@core/user/user-constants';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CAROUSEL_CONTROL_SIZE } from '../carousel-slides/carousel-slides.component';

@Component({
  selector: 'tsl-item-card-wide',
  templateUrl: './item-card-wide.component.html',
  styleUrls: ['./item-card-wide.component.scss'],
})
export class ItemCardWideComponent {
  @Input() item: ItemCard;
  @Input() itemExtraInfo: string[];
  @Input() showFavourite = true;

  @Output() toggleFavourite: EventEmitter<void> = new EventEmitter<void>();

  public readonly PERMISSIONS = PERMISSIONS;
  public readonly carouselControlSize = CAROUSEL_CONTROL_SIZE.SMALL;

  constructor(public typeCheckService: TypeCheckService, public deviceDetectorService: DeviceDetectorService) {}

  public toggleItemFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleFavourite.emit();
  }
}
