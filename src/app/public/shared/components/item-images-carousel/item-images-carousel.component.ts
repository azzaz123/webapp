import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { DeviceService } from '@core/device/device.service';
import { CarouselSlide } from '../carousel-slides/carousel-slide.interface';
import { STATUS_ITEM_FLAG_TYPES, BUMPED_ITEM_FLAG_TYPES } from '../item-flag/item-flag-constants';

@Component({
  selector: 'tsl-item-images-carousel',
  templateUrl: './item-images-carousel.component.html',
  styleUrls: ['./item-images-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemImagesCarouselComponent implements OnInit {
  @Input() isExpired = false;
  @Input() images: string[];
  @Input() statusFlag: STATUS_ITEM_FLAG_TYPES;
  @Input() bumpedFlag: BUMPED_ITEM_FLAG_TYPES;
  @Output() imageClick: EventEmitter<CarouselSlide> = new EventEmitter<CarouselSlide>();
  public smallerIndicators = false;

  constructor(private deviceService: DeviceService) {}

  ngOnInit() {
    this.checkIfNeedsSmallerIndicators();
  }

  private checkIfNeedsSmallerIndicators() {
    if (this.images?.length > 10 && this.deviceService.isMobile()) {
      this.smallerIndicators = true;
    }
  }
}
