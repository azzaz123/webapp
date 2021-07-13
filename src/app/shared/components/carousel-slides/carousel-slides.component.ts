import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
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

export const PREV_CONTROL_CLASS_NAME = '.carousel-control-prev';
export const NEXT_CONTROL_CLASS_NAME = '.carousel-control-next';

export enum SWIPE_DIRECTION {
  'RIGHT',
  'LEFT',
}
export enum CAROUSEL_CONTROL_SIZE {
  SMALL,
  REGULAR,
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
  @Input() activeIndicatorWallaMain = false;
  @Input() initialIndex = 0;
  @Input() controlsSize = CAROUSEL_CONTROL_SIZE.REGULAR;

  public readonly IMAGE_FALLBACK = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
  public readonly SWIPE_DIRECTION = SWIPE_DIRECTION;
  public readonly NGB_SLIDE = 'ngb-slide-';
  public readonly CONTROLS_SIZES = CAROUSEL_CONTROL_SIZE;
  public slides: CarouselSliderDirective[];
  public activeId: string;

  constructor(private cdr: ChangeDetectorRef, private elementRef: ElementRef) {}

  ngAfterContentInit() {
    this.slides = this.sections.toArray();
    this.activeId = this.NGB_SLIDE + this.initialIndex;
    this.cdr.detectChanges();
    this.preventPropagationOnControlsClick();
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

  private preventPropagationOnControlsClick(): void {
    const carouselElement = this.elementRef.nativeElement;
    const controlElements = carouselElement.querySelectorAll(`${PREV_CONTROL_CLASS_NAME}, ${NEXT_CONTROL_CLASS_NAME}`);

    controlElements.forEach((e: HTMLInputElement) => {
      e.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
  }

  get isSingleSlide(): boolean {
    return this.slides?.length <= 1;
  }

  get currentSlide(): string {
    return this.carousel?.activeId || this.NGB_SLIDE + 0;
  }
}
