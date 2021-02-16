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
import { DeviceDetectorService } from 'ngx-device-detector';

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
  @Input() initialIndex: number = 0;
  @Input() isFullScreen = false;
  @Input() className: string;

  public readonly IMAGE_FALLBACK = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
  public readonly NGB_SLIDE = 'ngb-slide-';
  public slides: CarouselSliderDirective[];
  public hideControllers: boolean;
  public activeId: string;

  constructor(private deviceDetectorService: DeviceDetectorService, private cdr: ChangeDetectorRef) {}

  ngAfterContentInit() {
    this.slides = this.sections.toArray();
    this.activeId = this.NGB_SLIDE + this.initialIndex;
    this.checkHideControllers();
    this.cdr.detectChanges();
  }

  public emitCurrentIndex(slideIndex: number): void {
    this.slideClick.emit({ index: slideIndex });
  }

  private checkHideControllers(): void {
    this.hideControllers = this.slides?.length <= 1 || (this.deviceDetectorService.isMobile() && this.isFullScreen);
  }

  get currentSlide(): string {
    return this.carousel?.activeId || this.NGB_SLIDE + 0;
  }
}
