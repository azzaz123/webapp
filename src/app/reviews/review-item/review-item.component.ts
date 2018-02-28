import { Component, OnInit, Input } from '@angular/core';
import { Review } from "../../core/review/review";
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH, ITEM_BASE_PATH, USER_BASE_PATH } from 'shield';
import { environment } from "../../../environments/environment";

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

  constructor() { }

  ngOnInit() {
    this.fallback = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
    this.itemWebLink = this.review.item ?
      this.review.item.webLink.replace(ITEM_BASE_PATH, environment.siteUrl + 'item/') : null;
    this.userWebSlug = this.review.user ?
      this.review.user.webLink.replace(USER_BASE_PATH, environment.siteUrl + 'user/') : null;
  }

}
