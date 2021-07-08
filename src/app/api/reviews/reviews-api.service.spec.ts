import { TestBed } from '@angular/core/testing';

import { ReviewsApiService } from './reviews-api.service';
import { ReviewsHttpService } from '@api/reviews/http/reviews-http.service';
import { reviewFixture, reviewUserFixture } from '@api/fixtures/reviews/review.fixture';
import { Review } from '@private/features/reviews/core/review';
import { of } from 'rxjs';
import { reviewsElementDtoFixture } from '@api/fixtures/reviews/reviews-element-dto.fixture';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
      spyOn(httpService, 'getUserReviews').and.returnValue(of([reviewsElementDtoFixture]));
      let reviews: Review[];

      service.getUserReviews(reviewUserFixture.id).subscribe((revs) => (reviews = revs));

      expect(reviews).toEqual([reviewFixture]);

      reviews.forEach((review) => {
        expect(review).toBeInstanceOf(Review);
      });
    });
  });
});
