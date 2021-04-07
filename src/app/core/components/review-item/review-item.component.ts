import { Component, Inject, Input, OnInit } from '@angular/core';
import { CategoryResponse } from '@core/category/category-response.interface';
import { CategoryService } from 'app/core/category/category.service';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from 'app/core/item/item';
import { Review } from '@private/features/reviews/core/review';

export interface ReviewItemCopys {
  soldCopy: string;
  boughtCopy: string;
}

@Component({
  selector: 'tsl-review-item',
  templateUrl: './review-item.component.html',
  styleUrls: ['./review-item.component.scss'],
})
export class ReviewItemComponent implements OnInit {
  @Input() isOwner = false;
  @Input() review: Review;
  public fallback: string;
  public itemWebLink: string;
  public userWebSlug: string;
  public category: CategoryResponse;
  public reviewItemCopys: ReviewItemCopys;

  constructor(@Inject('SUBDOMAIN') private subdomain: string, private categoryService: CategoryService) {}

  ngOnInit() {
    this.fallback = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
    this.itemWebLink = this.review.item ? this.review.item.getUrl(this.subdomain) : null;
    this.userWebSlug = this.review.user ? this.review.user.getUrl(this.subdomain) : null;
    this.initializeCopys();
    this.categoryService.getCategoryById(this.review.item.categoryId).subscribe((category: CategoryResponse) => {
      this.category = category;
    });
  }

  private initializeCopys(): void {
    this.reviewItemCopys = {
      soldCopy: this.isOwner ? $localize`:@@OwnReviewSold:Sold` : $localize`:@@ReviewSold:Sold`,
      boughtCopy: this.isOwner ? $localize`:@@OwnReviewBought:Bought` : $localize`:@@ReviewBought:Bought`,
    };
  }
}
