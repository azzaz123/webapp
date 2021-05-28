import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '@core/item/item';
import { CarouselSliderDirective } from './directives/carousel-slider.directive';
import { CarouselSlide } from './carousel-slide.interface';

export enum SWIPE_DIRECTION {
  'RIGHT',
  'LEFT',
}
@Component({
  selector: 'tsl-carousel-slides',
  templateUrl: './carousel-slides.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./carousel-slides.component.scss'],
})
export class SlidesCarouselComponent implements AfterContentInit {
  @ContentChildren(CarouselSliderDirective) sections: QueryList<CarouselSliderDirective>;
  @ViewChild(NgbCarousel) public carousel: NgbCarousel;
  @Output() slideClick: EventEmitter<CarouselSlide> = new EventEmitter<CarouselSlide>();
  @Input() noBackgroundIndicators: boolean;
  @Input() hideControllers = false;
  @Input() hideIndicators = false;
  @Input() initialIndex = 0;

  public readonly IMAGE_FALLBACK = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
  public readonly SWIPE_DIRECTION = SWIPE_DIRECTION;
  public readonly NGB_SLIDE = 'ngb-slide-';
  public slides: CarouselSliderDirective[];
  public activeId: string;
  public manyImages = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit() {
    this.slides = this.sections.toArray();
    this.checkManyImages();
    this.activeId = this.NGB_SLIDE + this.initialIndex;
    this.cdr.detectChanges();
  }

  public emitCurrentIndex(slideIndex: number): void {
    this.slideClick.emit({ index: slideIndex });
  }

  public swipe(swipeDirection: SWIPE_DIRECTION): void {
    if (this.isTouchDevice()) {
      if (swipeDirection === SWIPE_DIRECTION.RIGHT) {
        this.carousel.prev();
      }
      if (swipeDirection === SWIPE_DIRECTION.LEFT) {
        this.carousel.next();
      }
    }
  }

  private isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }

  private checkManyImages(): void {
    this.manyImages = this.slides?.length > 10;
  }

  get isSingleSlide(): boolean {
    return this.slides?.length <= 1;
  }

  get currentSlide(): string {
    return this.carousel?.activeId || this.NGB_SLIDE + 0;
  }
}
