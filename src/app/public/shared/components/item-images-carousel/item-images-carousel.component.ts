import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { ItemFlags } from '@core/item/item-response.interface';
import { CarouselImage } from '../images-carousel/images-carousel.interface';
import { ITEM_FLAG_TYPES, LEFT_FLAGS } from '../item-flag/item-flag-constants';

@Component({
  selector: 'tsl-item-images-carousel',
  templateUrl: './item-images-carousel.component.html',
  styleUrls: ['./item-images-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemImagesCarouselComponent {
  public readonly ITEM_FLAG_TYPES = ITEM_FLAG_TYPES;
  @Input() images: string[];
  @Input() itemFlags: ItemFlags;
  @Output() imageClick: EventEmitter<CarouselImage> = new EventEmitter<CarouselImage>();

  get leftFlagType(): ITEM_FLAG_TYPES {
    if (this.itemFlags) {
      const flagStatus = Object.keys(this.itemFlags).find((itemStatus: string) => {
        if (LEFT_FLAGS.some((flag) => flag.id === itemStatus) && this.itemFlags[itemStatus]) {
          return itemStatus;
        }
      });

      return LEFT_FLAGS.find((flag) => flag.id === flagStatus)?.itemType;
    }
  }
}
