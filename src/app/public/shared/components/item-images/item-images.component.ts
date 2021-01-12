import { Component, OnInit, ViewChild } from '@angular/core';
import { Image } from '@core/user/user-response.interface';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { SWIPE_TYPE } from '@public/shared/constants/swipeType.enum';
import { IMAGE, IMAGE_2 } from '@fixtures/user.fixtures.spec';

@Component({
  selector: 'tsl-item-images',
  templateUrl: './item-images.component.html',
  styleUrls: ['./item-images.component.scss'],
})
export class ItemImagesComponent implements OnInit {
  @ViewChild(NgbCarousel) public carousel: NgbCarousel;
  public SWIPE_TYPE_ENUM = SWIPE_TYPE;
  images: Image[] = [IMAGE, IMAGE_2, IMAGE, IMAGE_2];

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
}
