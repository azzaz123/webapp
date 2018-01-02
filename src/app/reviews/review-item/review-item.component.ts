import { Component, OnInit, Input } from '@angular/core';
import { MyReviews } from "../../core/my-reviews/my-reviews";
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH, ITEM_BASE_PATH } from 'shield';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'tsl-review-item',
  templateUrl: './review-item.component.html',
  styleUrls: ['./review-item.component.scss']
})
export class ReviewItemComponent implements OnInit {

  @Input() review: MyReviews;
  public fallback: string;
  public itemWebLink: string;
  public userWebSlug: string;

  constructor() { }

  ngOnInit() {
    this.fallback = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
    this.itemWebLink = environment.siteUrl + 'item/' + this.review.item.web_link;
    this.userWebSlug = environment.siteUrl + 'item/' + this.review.user.web_slug;
  }

}
