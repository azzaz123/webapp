import { Injectable } from '@angular/core';
import { Review } from '@private/features/reviews/core/review';
import { Observable } from 'rxjs';
import { ReviewsHttpService } from '@api/reviews/http/reviews-http.service';
import { map } from 'rxjs/operators';
import { ReviewsElementDto } from '@api/reviews/dtos/reviews-element-dto.interface';
import { mapReviewElementsToReviews } from '@api/reviews/mappers/reviews.mapper';
import { ReviewTranslationDto } from '@api/reviews/dtos/review-translation-dto.interface';
import { PaginatedList } from '@api/core/model';

@Injectable()
export class ReviewsApiService {
  public constructor(private httpService: ReviewsHttpService) {}

  public getUserReviews(userId: string, paginationParameter: string): Observable<PaginatedList<Review>> {
    return this.httpService.getUserReviews(userId, paginationParameter).pipe(
      map((response: PaginatedList<ReviewsElementDto>) => {
        return {
          ...response,
          list: mapReviewElementsToReviews(response.list),
        };
      })
    );
  }

  public getReviewTranslation(reviewId: string): Observable<string> {
    return this.httpService
      .getReviewTranslation(reviewId)
      .pipe(map((reviewTranslation: ReviewTranslationDto) => reviewTranslation.comments));
  }
}
