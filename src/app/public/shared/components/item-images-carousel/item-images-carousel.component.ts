import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { PERMISSIONS } from '@core/user/user-constants';
import { CarouselSlide } from '@shared/components/carousel-slides/carousel-slide.interface';
import { STATUS_ITEM_FLAG_TYPES, BUMPED_ITEM_FLAG_TYPES } from '../item-flag/item-flag-constants';

@Component({
  selector: 'tsl-item-images-carousel',
  templateUrl: './item-images-carousel.component.html',
  styleUrls: ['./item-images-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemImagesCarouselComponent {
  @Input() isExpired = false;
  @Input() images: string[];
  @Input() statusFlag: STATUS_ITEM_FLAG_TYPES;
  @Input() bumpedFlag: BUMPED_ITEM_FLAG_TYPES;
  @Output() imageClick: EventEmitter<CarouselSlide> = new EventEmitter<CarouselSlide>();

  public readonly PERMISSIONS = PERMISSIONS;
}
