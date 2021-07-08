import { TestBed } from '@angular/core/testing';

import { ReviewsApiService } from './reviews-api.service';
import { ReviewsHttpService } from '@api/reviews/http/reviews-http.service';
import { reviewFixture, reviewUserFixture } from '@api/fixtures/reviews/review.fixture';
import { Review } from '@private/features/reviews/core/review';
import { of } from 'rxjs';
import { reviewsElementDtoFixture } from '@api/fixtures/reviews/reviews-element-dto.fixture';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PaginatedList } from '@api/core/model/paginated-list.interface';

describe('ReviewsApiService', () => {
  let service: ReviewsApiService;
  let httpService: ReviewsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReviewsApiService, ReviewsHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ReviewsApiService);
    httpService = TestBed.inject(ReviewsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked to retrieve reviews', () => {
    it('should retrieve reviews', () => {
      spyOn(httpService, 'getUserReviews').and.returnValue(of({ list: [reviewsElementDtoFixture], paginationParameter: null }));
      let reviews: PaginatedList<Review>;

      service.getUserReviews(reviewUserFixture.id, '0').subscribe((revs) => (reviews = revs));

      expect(reviews).toEqual({ list: [reviewFixture], paginationParameter: null });

      reviews.list.forEach((review) => {
        expect(review).toBeInstanceOf(Review);
      });
    });
  });
});
