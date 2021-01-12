import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Image } from '@core/user/user-response.interface';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { SWIPE_TYPE } from '@public/shared/constants/swipeType.enum';
import { IMAGE, IMAGE_2 } from '@fixtures/user.fixtures.spec';
import { ItemFlags } from '@core/item/item-response.interface';

@Component({
  selector: 'tsl-item-images',
  templateUrl: './item-images.component.html',
  styleUrls: ['./item-images.component.scss'],
})
export class ItemImagesComponent implements OnInit {
  @ViewChild(NgbCarousel) public carousel: NgbCarousel;
  public SWIPE_TYPE_ENUM = SWIPE_TYPE;
  @Input() images: Image[] = [IMAGE, IMAGE_2, IMAGE, IMAGE_2];
  @Input() itemFlags: ItemFlags = {
    pending: false,
    sold: true,
    favorite: false,
    reserved: true,
    removed: false,
    banned: false,
    expired: false,
    review_done: false,
    bumped: true,
    highlighted: false,
  };

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
