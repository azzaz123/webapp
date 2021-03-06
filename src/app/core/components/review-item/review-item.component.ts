import { Component, Input, OnInit } from '@angular/core';
import { CategoryResponse } from '@core/category/category-response.interface';
import { CategoryService } from 'app/core/category/category.service';
import { FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from 'app/core/item/item';
import { Review } from '@private/features/reviews/core/review';
import { User } from '@core/user/user';
import { ReviewsApiService } from '@api/reviews';
import { finalize, take } from 'rxjs/operators';
import { TranslateButtonCopies } from '@core/components/translate-button/interfaces';

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
  public reviewUser: User;
  public category: CategoryResponse;
  public reviewItemCopies: ReviewItemCopies;

  public isTranslated = false;
  public reviewComment: string;
  public translationButtonCopies: TranslateButtonCopies = {
    showTranslation: $localize`:@@user_profile_reviews_translate_button:Translate review`,
    showOriginal: $localize`:@@user_profile_reviews_show_original_text_button:View original text`,
  };
  private translation: string;
  private loadingTranslation: boolean;

  constructor(private categoryService: CategoryService, private reviewsApiService: ReviewsApiService) {}

  public ngOnInit(): void {
    this.fallback = FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH;
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

    const needsToRetrieveTranslation = !this.isTranslated && !this.translation;
    if (needsToRetrieveTranslation) {
      this.retrieveTranslation();
    } else {
      this.translateReviewText(!this.isTranslated);
    }
  }

  public limitCommentChars(comment) {
    if (comment) {
      return comment.length > 0 && comment.length <= 150 ? comment : comment.substr(0, 150) + '...';
    } else {
      return '';
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
      .pipe(
        take(1),
        finalize(() => {
          this.loadingTranslation = false;
        })
      )
      .subscribe((translation) => {
        this.translation = translation;
        this.translateReviewText(true);
      });
  }

  private initializeCopies(): void {
    this.reviewItemCopies = {
      soldCopy: this.isOwner ? $localize`:@@web_own_review_sold:Sold` : $localize`:@@web_review_sold:Sold`,
      boughtCopy: this.isOwner ? $localize`:@@web_own_review_bought:Bought` : $localize`:@@web_review_bought:Bought`,
    };
  }
}
