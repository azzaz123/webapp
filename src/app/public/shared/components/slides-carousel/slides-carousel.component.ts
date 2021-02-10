import { Component, ContentChildren, EventEmitter, Input, Output, QueryList, ViewChild } from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '@core/item/item';
import { CarouselSliderDirective } from './directives/carousel-slider.directive';
import { SlideCarousel } from './slides-carousel.interface';

@Component({
  selector: 'tsl-slides-carousel',
  templateUrl: './slides-carousel.component.html',
  styleUrls: ['./slides-carousel.component.scss'],
})
export class SlidesCarouselComponent {
  @ContentChildren(CarouselSliderDirective) sections: QueryList<CarouselSliderDirective>;
  @ViewChild(NgbCarousel) public carousel: NgbCarousel;
  @Output() slideClick: EventEmitter<SlideCarousel> = new EventEmitter<SlideCarousel>();
  @Input() slideIndex: number;
  @Input() className: string;

  public readonly IMAGE_FALLBACK = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
  public readonly NGB_SLIDE = 'ngb-slide-';
  public slides: CarouselSliderDirective[];

  ngAfterContentInit() {
    this.slides = this.sections.toArray();
  }

  public emitCurrentIndex(slideIndex: number): void {
    this.slideClick.emit({ index: slideIndex });
  }

  get indexSlide(): number {
    return parseInt(this.currentSlide.replace(this.NGB_SLIDE, ''));
  }

  get currentSlide(): string {
    return this.carousel?.activeId || this.NGB_SLIDE + 0;
  }
}
