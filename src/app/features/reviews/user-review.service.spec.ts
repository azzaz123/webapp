import {
  MOCK_REVIEWS,
  REVIEWS_RESPONSE,
} from './../../../tests/review.fixtures.spec';
import { environment } from './../../../environments/environment';
import { TestBed } from '@angular/core/testing';
import { UserReviewService, USER_REVIEWS_API_URL } from './user-review.service';
import { ReviewsData } from './review-response.interface';

import {
  TestRequest,
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';

describe('UserReviewService', () => {
  let service: UserReviewService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserReviewService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('getPaginationReviews', () => {
    it('should call reviews endpoint and return reviews', () => {
      const expectedUrlParams = `init=0`;
      const expectedUrl = `${environment.baseUrl}${USER_REVIEWS_API_URL}?${expectedUrlParams}`;
      let response: ReviewsData;

      service.getPaginationReviews(0).subscribe((r) => (response = r));
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(REVIEWS_RESPONSE, { headers: { 'x-nextpage': 'init=1' } });

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response.data).toEqual(MOCK_REVIEWS);
      expect(response.init).toEqual(1);
      expect(req.request.method).toBe('GET');
    });
  });
});
