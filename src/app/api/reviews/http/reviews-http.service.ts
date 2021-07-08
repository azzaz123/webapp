import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { USER_REVIEWS_ENDPOINT } from '@api/reviews/http/endpoints';
import { ReviewsResponseDto } from '@api/reviews/dtos/reviews-response-dto.interface';
import { PaginatedList } from '@api/core/model/paginated-list.interface';
import { ReviewsElementDto } from '@api/reviews/dtos/reviews-element-dto.interface';
import { PaginationService } from '@api/core/utils/pagination/pagination.service';

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
}
