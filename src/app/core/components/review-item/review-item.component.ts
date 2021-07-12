import { Component, Inject, Input, OnInit } from '@angular/core';
import { CategoryResponse } from '@core/category/category-response.interface';
import { CategoryService } from 'app/core/category/category.service';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from 'app/core/item/item';
import { Review } from '@private/features/reviews/core/review';
import { User } from '@core/user/user';
import { ReviewsApiService } from '@api/reviews';
import { take } from 'rxjs/operators';

export interface ReviewItemCopies {
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
  public reviewUser: User;
  public category: CategoryResponse;
  public reviewItemCopies: ReviewItemCopies;

  public isTranslated = false;
  public reviewComment: string;
  private translation: string;
  private loadingTranslation: boolean;

  constructor(
    @Inject('SUBDOMAIN') private subdomain: string,
    private categoryService: CategoryService,
    private reviewsApiService: ReviewsApiService
  ) {}

  public ngOnInit(): void {
    this.fallback = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
    this.itemWebLink = this.review.item ? this.review.item.getUrl(this.subdomain) : null;
    this.reviewUser = this.review.user;
    this.reviewComment = this.review.comments;
    this.initializeCopies();
    this.categoryService.getCategoryById(this.review.item.categoryId).subscribe((category: CategoryResponse) => {
      this.category = category;
    });
  }

  public toggleTranslation(): void {
    if (this.loadingTranslation) {
      return;
    }

    const willTranslate = !this.isTranslated;
    if (willTranslate && !this.translation) {
      this.retrieveTranslation();
    } else {
      this.translateReviewText(willTranslate);
    }
  }

  private translateReviewText(translated: boolean): void {
    this.isTranslated = translated;
    this.reviewComment = translated ? this.translation : this.review.comments;
  }

  private retrieveTranslation(): void {
    this.loadingTranslation = true;
    this.reviewsApiService
      .getReviewTranslation(this.review.id)
      .pipe(take(1))
      .subscribe((translation) => {
        this.translation = translation;
        this.translateReviewText(true);
        this.loadingTranslation = false;
      });
  }

  private initializeCopies(): void {
    this.reviewItemCopies = {
      soldCopy: this.isOwner ? $localize`:@@web_own_review_sold:Sold` : $localize`:@@web_review_sold:Sold`,
      boughtCopy: this.isOwner ? $localize`:@@web_own_review_bought:Bought` : $localize`:@@web_review_bought:Bought`,
    };
  }
}
