import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MyReviewsResponse, MyReviewsData } from './my-reviews-response.interface';
import { Response } from '@angular/http';
import {
  HttpService,
  User
} from 'shield';
import { MyReviews } from './my-reviews';
import { CategoryService } from '../category/category.service';
import { CategoryResponse } from '../category/category-response.interface';
import { ReviewItem } from './review-item';
import {Review} from "./review";

@Injectable()
export class MyReviewsService {

  private API_URL_v3_USER: string = 'api/v3/users';
  
  constructor(private http: HttpService,
              private categoryService: CategoryService) {
  }

  public getPaginationReviews(url: string, init): Observable<MyReviewsData> {
    return this.http.get(url, {
        init: init
      })
      .map((r: Response) => {
          const res: MyReviewsResponse[] = r.json();
          const nextPage: string = r.headers.get('x-nextpage');
          const nextInit: number = nextPage ? +nextPage.replace('init=', '') : null;
          const data: MyReviews[] = this.mapResponse(res);

          return {
            data: data,
            init: nextInit
          }
        }
      )
  }

  private mapResponse(res: MyReviewsResponse[]): MyReviews[] {
    return res.map((reviewResponse: MyReviewsResponse) => {
      const item = this.mapItem(reviewResponse);
      const user = this.mapUser(reviewResponse);
      const review = this.mapReview(reviewResponse);

      return new MyReviews(
        item,
        review,
        reviewResponse.type,
        user
      );
    });
  }

  private mapReview(reviewResponse: MyReviewsResponse): Review {
    return new Review(
      reviewResponse.review.comments,
      reviewResponse.review.date,
      reviewResponse.review.scoring
    );
  }

  private mapItem(reviewResponse: MyReviewsResponse): ReviewItem {
    if (!reviewResponse.item) { return null; }

    return new ReviewItem(
      reviewResponse.item.id,
      reviewResponse.item.category_id,
      reviewResponse.item.title,
      reviewResponse.item.image,
      reviewResponse.item.web_link
    );
  }

  private mapUser(reviewResponse: MyReviewsResponse): User {
    return new User(
      reviewResponse.user.id,
      reviewResponse.user.micro_name,
      {urls_by_size: reviewResponse.user.image},
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

  public myReviews(init: number): Observable<MyReviewsData> {
    return this.getPaginationReviews(this.API_URL_v3_USER + '/me/reviews', init);
  }
}
