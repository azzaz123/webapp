import { TestBed } from '@angular/core/testing';

import { ReviewsHttpService } from './reviews-http.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import { reviewsElementDtoFixture } from '@api/fixtures/reviews/reviews-element-dto.fixture';
import { PaginatedList } from '@api/core/model/paginated-list.interface';
import { ReviewsElementDto } from '@api/reviews/dtos/reviews-element-dto.interface';
import { reviewTranslationDtoFixture } from '@api/fixtures/reviews/review-translation-dto.fixture';
import { ReviewTranslationDto } from '@api/reviews/dtos/review-translation-dto.interface';

describe('ReviewsHttpService', () => {
  let service: ReviewsHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewsHttpService],
    });
    service = TestBed.inject(ReviewsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked to retrieve user reviews', () => {
    it('should get reviews', () => {
      let response: PaginatedList<ReviewsElementDto>;
      const userId = 'id';

      service.getUserReviews(userId, '0').subscribe((res: PaginatedList<ReviewsElementDto>) => (response = res));

      const req: TestRequest = httpMock.expectOne(`${environment.baseUrl}api/v3/users/${userId}/reviews?init=0`);
      req.flush([reviewsElementDtoFixture]);

      expect(response).toEqual({ list: [reviewsElementDtoFixture], paginationParameter: null });
    });
  });

  describe('when asked to retrive review translation', () => {
    it('should get the review translation', () => {
      let response: ReviewTranslationDto;
      const reviewId = 'id';

      service.getReviewTranslation(reviewId).subscribe((res: ReviewTranslationDto) => (response = res));

      const req: TestRequest = httpMock.expectOne(`${environment.baseUrl}api/v3/reviews/${reviewId}/translation`);
      req.flush(reviewTranslationDtoFixture);

      expect(response).toEqual(reviewTranslationDtoFixture);
    });
  });
});
