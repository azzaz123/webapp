import { TestBed } from '@angular/core/testing';
import { UserReviewService, USER_REVIEWS_API_URL } from './user-review.service';
import { ReviewsData } from './review-response.interface';
import { REVIEWS_RESPONSE, MOCK_REVIEWS } from '../../tests/review.fixtures.spec';
import { TestRequest, HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

fdescribe('UserReviewService', () => {

  let service: UserReviewService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserReviewService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(UserReviewService);
    httpMock = TestBed.get(HttpTestingController);
  });

  describe('getPaginationReviews', () => {
    it('should call reviews endpoint and return reviews', () => {
      const expectedUrlParams = `init=0`;
      const expectedUrl = `${environment.baseUrl}${USER_REVIEWS_API_URL}?${expectedUrlParams}`;
      let response: ReviewsData;

      service.getPaginationReviews(0).subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush(REVIEWS_RESPONSE);

      expect(req.request.urlWithParams).toEqual(expectedUrl);
      expect(response.data).toEqual(MOCK_REVIEWS);
      expect(req.request.method).toBe('GET');
    });
  });
  
});
