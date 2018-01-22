import { Component, OnInit, Input } from '@angular/core';
import { Review } from "../../core/review/review";
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH, ITEM_BASE_PATH, USER_BASE_PATH } from 'shield';
import { environment } from "../../../environments/environment";
import { CategoryService } from '../../core/category/category.service';
import { CategoryResponse } from "../../core/category/category-response.interface";

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
  public categoryName: string;
  public categoryIconName: string;

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.fallback = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
    this.itemWebLink = this.review.item ?
      this.review.item.webLink.replace(ITEM_BASE_PATH, environment.siteUrl + 'item/') : null;
    this.userWebSlug = this.review.user ?
      this.review.user.webLink.replace(USER_BASE_PATH, environment.siteUrl + 'user/') : null;
    if (this.review.item) {
      this.categoryService.getCategoryById(this.review.item.categoryId).subscribe((category: CategoryResponse) => {
        this.categoryName = category.title;
        this.categoryIconName = category.iconName;
      });
    }
  }

}
