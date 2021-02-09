import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CarouselImage } from '../images-carousel/images-carousel.interface';
import { ItemFlags, ItemVisibilityFlags } from '@core/item/item-response.interface';
import {
  EMPTY_ITEM_FLAGS,
  EMPTY_ITEM_VISIBILITY_FLAGS,
  STATUS_FLAGS,
  STATUS_ITEM_FLAG_TYPES,
  BUMPED_ITEM_FLAG_TYPES,
} from '../item-flag/item-flag-constants';

@Component({
  selector: 'tsl-item-images-carousel',
  templateUrl: './item-images-carousel.component.html',
  styleUrls: ['./item-images-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemImagesCarouselComponent {
  public currentIndex = 0;
  @Input() images: string[];
  @Output() imageClick: EventEmitter<CarouselImage> = new EventEmitter<CarouselImage>();
  @Input() itemFlags: ItemFlags = EMPTY_ITEM_FLAGS;
  @Input() itemVisibilityFlags: ItemVisibilityFlags = EMPTY_ITEM_VISIBILITY_FLAGS;

  get statusFlag(): STATUS_ITEM_FLAG_TYPES {
    if (this.itemFlags) {
      const flagStatus = Object.keys(this.itemFlags).find((itemStatus: string) => {
        if (STATUS_FLAGS.some((flag) => flag.id === itemStatus) && this.itemFlags[itemStatus]) {
          return itemStatus;
        }
      });

      return STATUS_FLAGS.find((flag) => flag.id === flagStatus)?.itemType as STATUS_ITEM_FLAG_TYPES;
    }
  }

  get bumpedFlag(): BUMPED_ITEM_FLAG_TYPES {
    if (this.itemVisibilityFlags?.country_bumped) {
      return BUMPED_ITEM_FLAG_TYPES.COUNTRY_BUMP;
    }

    if (this.itemVisibilityFlags?.bumped) {
      return BUMPED_ITEM_FLAG_TYPES.BUMPED;
    }
  }
}
