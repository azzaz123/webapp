import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { REVIEW_TRANSLATION_ENDPOINT, USER_REVIEWS_ENDPOINT } from '@api/reviews/http/endpoints';
import { ReviewsResponseDto } from '@api/reviews/dtos/reviews-response-dto.interface';
import { ReviewsElementDto } from '@api/reviews/dtos/reviews-element-dto.interface';
import { PaginationService } from '@api/core/utils/pagination/pagination.service';
import { ReviewTranslationDto } from '@api/reviews/dtos/review-translation-dto.interface';
import { PaginatedList } from '@api/core/model';

@Injectable()
export class ReviewsHttpService {
  public constructor(private http: HttpClient, private paginationService: PaginationService) {}

  public getUserReviews(userId: string, paginationParameter: string): Observable<PaginatedList<ReviewsElementDto>> {
    return this.paginationService.getList<ReviewsElementDto>(
      this.http.get<ReviewsResponseDto>(USER_REVIEWS_ENDPOINT(userId), {
        params: { init: paginationParameter || '0' },
        observe: 'response',
      })
    );
  }

  public getReviewTranslation(reviewId: string): Observable<ReviewTranslationDto> {
    return this.http.get<ReviewTranslationDto>(REVIEW_TRANSLATION_ENDPOINT(reviewId));
  }
}
