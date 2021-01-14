import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { SWIPE_TYPE } from '@public/shared/constants/swipeType.enum';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '@core/item/item';

@Component({
  selector: 'tsl-images-carousel',
  templateUrl: './images-carousel.component.html',
  styleUrls: ['./images-carousel.component.scss'],
})
export class ImagesCarouselComponent {
  public readonly IMAGE_FALLBACK = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
  public SWIPE_TYPE = SWIPE_TYPE;
  public readonly NGB_SLIDE = 'ngb-slide-';

  @ViewChild(NgbCarousel) public carousel: NgbCarousel;
  @Input() images: string[];
  @Output() currentImageIndex: EventEmitter<number> = new EventEmitter<
    number
  >();

  constructor() {}

  public onSwipe(swipe: SWIPE_TYPE): void {
    if (swipe === SWIPE_TYPE.RIGHT) {
      this.carousel.prev();
    }

    if (swipe === SWIPE_TYPE.LEFT) {
      this.carousel.next();
    }
  }

  get currentSlide(): string {
    return this.carousel?.activeId || this.NGB_SLIDE + 0;
  }

  public emitCurrentImage(imageIndex: number): void {
    this.currentImageIndex.emit(imageIndex);
  }
}
