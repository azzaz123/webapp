import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '@core/item/item';

@Component({
  selector: 'tsl-images-carousel',
  templateUrl: './images-carousel.component.html',
  styleUrls: ['./images-carousel.component.scss'],
})
export class ImagesCarouselComponent {
  public readonly IMAGE_FALLBACK = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
  public readonly NGB_SLIDE = 'ngb-slide-';

  @ViewChild(NgbCarousel) public carousel: NgbCarousel;
  @Input() images: string[];
  @Input() paginationSize = 3;
  @Output() currentImageIndex: EventEmitter<number> = new EventEmitter<
    number
  >();

  constructor() {}

  get currentSlide(): string {
    return this.carousel?.activeId || this.NGB_SLIDE + 0;
  }

  public emitCurrentImage(imageIndex: number): void {
    this.currentImageIndex.emit(imageIndex);
  }

  public canLoadImage(i: number): boolean {
    return this.isSlideAllowed(i);
  }

  private isSlideAllowed(slideId: number): boolean {
    const currentIndex = parseInt(this.currentSlide.slice(-1));
    const templateSlide = `${this.NGB_SLIDE}${slideId}`;

    return [...Array(this.paginationSize).keys()].some(
      (slide: number) =>
        `${this.NGB_SLIDE}${currentIndex + slide}` === templateSlide
    );
  }
}
