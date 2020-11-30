import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewResponse, ReviewsData } from './review-response.interface';
import { Review } from './review';
import { ReviewItem } from './review-item';

import { HttpClient, HttpResponse } from '@angular/common/http';
import { User } from 'app/core/user/user';
import { environment } from 'environments/environment.beta';

export const USER_REVIEWS_API_URL = 'api/v3/users/me/reviews';

@Injectable()
export class UserReviewService {
  constructor(private http: HttpClient) {}

  public getPaginationReviews(init: number): Observable<ReviewsData> {
    return this.http
      .get<HttpResponse<ReviewResponse[]>>(
        `${environment.baseUrl}${USER_REVIEWS_API_URL}`,
        {
          params: {
            init,
          } as any,
          observe: 'response' as 'body',
        }
      )
      .pipe(
        map((r) => {
          const res: ReviewResponse[] = r.body;
          const nextPage: string = r.headers.get('x-nextpage');
          const nextInit: number = nextPage
            ? +nextPage.replace('init=', '')
            : null;
          const data: Review[] = this.mapResponse(res);

          return {
            data,
            init: nextInit,
          };
        })
      );
  }

  private mapResponse(res: ReviewResponse[]): Review[] {
    return res.map((reviewResponse: ReviewResponse) => {
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
