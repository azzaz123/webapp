import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { USER_REVIEWS_ENDPOINT } from '@api/reviews/http/endpoints';
import { ReviewsResponseDtoInterface } from '@api/reviews/dtos/reviews-response-dto.interface';

@Injectable()
export class ReviewsHttpService {
  public constructor(private http: HttpClient) {}

  public getUserReviews(userId: string): Observable<ReviewsResponseDtoInterface> {
    return this.http.get<ReviewsResponseDtoInterface>(USER_REVIEWS_ENDPOINT(userId));
  }
}
