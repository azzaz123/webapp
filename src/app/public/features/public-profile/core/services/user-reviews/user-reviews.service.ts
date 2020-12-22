import { Injectable } from '@angular/core';
import { User } from '@core/user/user';
import { Review } from '@features/reviews/core/review';
import { ReviewItem } from '@features/reviews/core/review-item';
import { ReviewResponse } from '@features/reviews/core/review-response.interface';

@Injectable()
export class UserReviewsService {
  constructor() {}

  public mapReviews(reviews: ReviewResponse[]): Review[] {
    return reviews.map((reviewResponse: ReviewResponse) => {
      const item: ReviewItem = this.mapItem(reviewResponse);
      const user: User = this.mapUser(reviewResponse);

      return new Review(
        reviewResponse.review.date,
        reviewResponse.review.scoring,
        reviewResponse.type,
        reviewResponse.review.comments,
        item,
        user
      );
    });
  }

  private mapItem(reviewResponse: ReviewResponse): ReviewItem {
    if (!reviewResponse.item) {
      return null;
    }

    return new ReviewItem(
      reviewResponse.item.id,
      reviewResponse.item.category_id,
      reviewResponse.item.title,
      reviewResponse.item.image,
      reviewResponse.item.web_link
    );
  }

  private mapUser(reviewResponse: ReviewResponse): User {
    if (!reviewResponse.user) {
      return null;
    }

    return new User(
      reviewResponse.user.id,
      reviewResponse.user.micro_name,
      reviewResponse.user.image
        ? { urls_by_size: reviewResponse.user.image }
        : null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      reviewResponse.user.web_slug
    );
  }
}
