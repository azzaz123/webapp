import {
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
import { ITEM_FLAG_TYPES } from '@public/shared/components/item-flag/item-flag.component';

@Component({
  selector: 'tsl-images-carousel',
  templateUrl: './images-carousel.component.html',
  styleUrls: ['./images-carousel.component.scss'],
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

  get leftFlagType(): string {
    if (this.itemFlags?.sold) return $localize`:@@Sold:Sold`;
    if (this.itemFlags?.reserved) return $localize`:@@Reserved:Reserved`;
    if (this.itemFlags?.expired) return $localize`:@@Expired:Expired`;
    if (this.itemFlags?.onhold) return $localize`:@@Inactive:Inactive`;
  }
}
