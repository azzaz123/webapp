import { TestBed } from '@angular/core/testing';
import { UserReviewService } from './user-review.service';
import { Observable } from 'rxjs';
import { ReviewsData } from './review-response.interface';
import { REVIEWS_RESPONSE, MOCK_REVIEWS } from '../../tests/review.fixtures.spec';
import { Response, ResponseOptions, Headers } from '@angular/http';
import { HttpService } from '../core/http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../tests/utils.spec';

describe('UserReviewService', () => {

  let service: UserReviewService;
  let http: HttpService;
  const API_URL_v3_USER = 'api/v3/users/me/reviews';
  const init = 1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserReviewService,
        ...TEST_HTTP_PROVIDERS
      ]
    });
    service = TestBed.get(UserReviewService);
    http = TestBed.get(HttpService);
  });

  describe('getPaginationReviews', () => {
    let resp: ReviewsData;

    beforeEach(() => {
      const res: ResponseOptions = new ResponseOptions({
        body: JSON.stringify(REVIEWS_RESPONSE),
        headers: new Headers({'x-nextpage': 'init=1'})
      });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.getPaginationReviews(init).subscribe((data: ReviewsData) => {
        resp = data;
      });
    });

    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith(API_URL_v3_USER, {init: init});
    });

    it('should return an array of reviews', () => {
      expect(resp.data).toEqual(MOCK_REVIEWS);
    });
  });
});
