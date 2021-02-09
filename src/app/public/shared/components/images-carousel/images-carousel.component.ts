import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
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
  @ContentChild('slider', { static: false }) slideTemplateRef: TemplateRef<any>;
  @Input() slides: any[];
  @Input() class: string;
  @Input() imageClass = 'cover';
  @Output() slideClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() nextIndexSlide: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  public emitNextIndex(): void {
    const futureIndexSlide = this.indexSlide + 1;

    this.nextIndexSlide.emit(futureIndexSlide === this.slides.length ? 0 : futureIndexSlide);
  }

  public emitCurrentIndex(): void {
    this.slideClick.emit(this.indexSlide);
  }

  get indexSlide(): number {
    return parseInt(this.currentSlide.replace(this.NGB_SLIDE, ''));
  }

  get currentSlide(): string {
    return this.carousel?.activeId || this.NGB_SLIDE + 0;
  }
}
