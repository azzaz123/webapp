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

  public emitCurrentImage(imageIndex: number): void {
    this.currentImageIndex.emit(imageIndex);
  }

  get currentSlide(): string {
    return this.carousel?.activeId || this.NGB_SLIDE + 0;
  }
}
