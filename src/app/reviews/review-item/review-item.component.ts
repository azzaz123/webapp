import { Component, Inject, Input, OnInit } from '@angular/core';
import { Review } from '../review';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '../../core/item/item';

@Component({
  selector: 'tsl-review-item',
  templateUrl: './review-item.component.html',
  styleUrls: ['./review-item.component.scss']
})
export class ReviewItemComponent implements OnInit {

  @Input() review: Review;
  public fallback: string;
  public itemWebLink: string;
  public userWebSlug: string;

  constructor(@Inject('SUBDOMAIN') private subdomain: string) { }

  ngOnInit() {
    this.fallback = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
    this.itemWebLink = this.review.item ? this.review.item.getUrl(this.subdomain) : null;
    this.userWebSlug = this.review.user ? this.review.user.getUrl(this.subdomain) : null;
  }

}
