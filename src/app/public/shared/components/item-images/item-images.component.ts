import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Image } from '@core/user/user-response.interface';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { SWIPE_TYPE } from '@public/shared/constants/swipeType.enum';
import { ItemFlags } from '@core/item/item-response.interface';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '@core/item/item';

@Component({
  selector: 'tsl-item-images',
  templateUrl: './item-images.component.html',
  styleUrls: ['./item-images.component.scss'],
})
export class ItemImagesComponent implements OnInit {
  public readonly IMAGE_FALLBACK = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
  public SWIPE_TYPE_ENUM = SWIPE_TYPE;
  @ViewChild(NgbCarousel) public carousel: NgbCarousel;
  @Input() images: Image[];
  @Input() itemFlags: ItemFlags;

  constructor() {}
  ngOnInit(): void {}

  onSwipe(swipe: SWIPE_TYPE): void {
    if (swipe === SWIPE_TYPE.RIGHT) {
      this.carousel.prev();
    }

    if (swipe === SWIPE_TYPE.LEFT) {
      this.carousel.next();
    }
  }

  openModalImageSlider(): void {}
}
