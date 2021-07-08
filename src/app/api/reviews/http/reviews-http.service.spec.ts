import { TestBed } from '@angular/core/testing';

import { ReviewsHttpService } from './reviews-http.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import { reviewsElementDtoFixture } from '@api/fixtures/reviews/reviews-element-dto.fixture';
import { ReviewsResponseDtoInterface } from '@api/reviews/dtos/reviews-response-dto.interface';

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
      let response: ReviewsResponseDtoInterface;
      const userId = 'id';

      service.getUserReviews(userId).subscribe((res: ReviewsResponseDtoInterface) => (response = res));

      const req: TestRequest = httpMock.expectOne(`${environment.baseUrl}api/v3/users/${userId}/reviews`);
      req.flush([reviewsElementDtoFixture]);

      expect(response).toEqual([reviewsElementDtoFixture]);
    });
  });
});
