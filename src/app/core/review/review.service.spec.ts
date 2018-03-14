import { TestBed } from '@angular/core/testing';
import { ReviewService } from './review.service';
import { Observable } from "rxjs/Observable";
import { ReviewsData } from "./review-response.interface";
import { REVIEWS_RESPONSE, MOCK_REVIEWS } from "../../../tests/review.fixtures.spec";
import { Response, ResponseOptions, Headers } from '@angular/http';
import { HttpService } from '../http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec.spec';

describe('ReviewService', () => {

  let service: ReviewService;
  let http : HttpService;
  const API_URL_v3_USER: string = 'api/v3/users/me/reviews';
  const init: number = 1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReviewService,
        ...TEST_HTTP_PROVIDERS
      ]
    });
    service = TestBed.get(ReviewService);
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
      expect(http.get).toHaveBeenCalledWith(API_URL_v3_USER, {init: init})
    });

    it('should return an array of reviews', () => {
      expect(resp.data).toEqual(MOCK_REVIEWS);
    });
  });
});
