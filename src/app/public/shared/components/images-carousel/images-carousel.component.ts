import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '@core/item/item';
import { CarouselImage } from '@public/shared/constants/images-carousel.interface';
import { ItemFlags } from '@core/item/item-response.interface';
import {
  FlagProperties,
  ITEM_FLAG_TYPES,
  LEFT_FLAGS,
} from '../item-flag/item-flag-constants';

@Component({
  selector: 'tsl-images-carousel',
  templateUrl: './images-carousel.component.html',
  styleUrls: ['./images-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagesCarouselComponent {
  public readonly ITEM_FLAG_TYPES = ITEM_FLAG_TYPES;
  public readonly IMAGE_FALLBACK = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
  public readonly NGB_SLIDE = 'ngb-slide-';

  @ViewChild(NgbCarousel) public carousel: NgbCarousel;
  @Input() images: string[];
  @Input() itemFlags: ItemFlags;
  @Output() imageClick: EventEmitter<CarouselImage> = new EventEmitter<
    CarouselImage
  >();

  constructor() {}

  public emitCurrentImage(imageIndex: number): void {
    this.imageClick.emit({ index: imageIndex });
  }

  get currentSlide(): string {
    return this.carousel?.activeId || this.NGB_SLIDE + 0;
  }

  get leftFlag(): FlagProperties {
    if (this.itemFlags) {
      const flagStatus = Object.keys(this.itemFlags).find(
        (itemStatus: string) => {
          if (
            LEFT_FLAGS.some((flag) => flag.id === itemStatus) &&
            this.itemFlags[itemStatus]
          ) {
            return itemStatus;
          }
        }
      );

      return LEFT_FLAGS.find((flag) => flag.id === flagStatus);
    }
  }
}
