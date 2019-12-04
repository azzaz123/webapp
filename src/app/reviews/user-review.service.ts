import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewResponse, ReviewsData } from './review-response.interface';
import { Response } from '@angular/http';
import { Review } from './review';
import { ReviewItem } from './review-item';
import { HttpService } from '../core/http/http.service';
import { User } from '../core/user/user';

@Injectable()
export class UserReviewService {

  private API_URL_v3_USER = 'api/v3/users';

  constructor(private http: HttpService) {
  }

  public getPaginationReviews(init: number): Observable<ReviewsData> {
    return this.http.get(this.API_URL_v3_USER + '/me/reviews', {
        init: init
      })
      .map((r: Response) => {
          const res: ReviewResponse[] = r.json();
          const nextPage: string = r.headers.get('x-nextpage');
          const nextInit: number = nextPage ? +nextPage.replace('init=', '') : null;
          const data: Review[] = this.mapResponse(res);

          return {
            data: data,
            init: nextInit
          };
        }
      );
  }

  public getAllReviews(start: number, offset: number): Observable<Review[]> {
    return this.recursiveReviews(start, offset).map(allReviewData => this.mapResponse(allReviewData));
  }

  private recursiveReviews(init: number, offset: number): Observable<ReviewResponse[]> {
    return this.http.get(this.API_URL_v3_USER + '/me/reviews', { init })
    .map(r => {
      const res: ReviewResponse[] = r.json();
      return res;
    })
    .flatMap(res => {
      if (res.length > 0) {
        return this.recursiveReviews(init + offset, offset).map(r => r.concat(res));
      } else {
        return Observable.of([]);
      }
    });
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
    if (!reviewResponse.item) { return null; }

    return new ReviewItem(
      reviewResponse.item.id,
      reviewResponse.item.category_id,
      reviewResponse.item.title,
      reviewResponse.item.image,
      reviewResponse.item.web_link
    );
  }

  private mapUser(reviewResponse: ReviewResponse): User {
    if (!reviewResponse.user) { return null; }

    return new User(
      reviewResponse.user.id,
      reviewResponse.user.micro_name,
      reviewResponse.user.image ? {urls_by_size: reviewResponse.user.image} : null,
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
