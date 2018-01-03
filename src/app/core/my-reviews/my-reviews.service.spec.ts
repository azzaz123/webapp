import { TestBed } from '@angular/core/testing';
import { MyReviewsService } from './my-reviews.service';
import { HttpService, TEST_HTTP_PROVIDERS } from 'shield';
import { Observable } from "rxjs/Observable";
import { MyReviewsData } from "./my-reviews-response.interface";
import { MY_REVIEWS_RESPONSE, MOCK_REVIEWS } from "../../../tests/review.fixtures";
import { Response, ResponseOptions, Headers } from '@angular/http';

describe('MyReviewsService', () => {

  let service: MyReviewsService;
  let http : HttpService;
  const API_URL_v3_USER: string = 'api/v3/users/me/reviews';
  const init: number = 1;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MyReviewsService,
        ...TEST_HTTP_PROVIDERS
      ]
    });
    service = TestBed.get(MyReviewsService);
    http = TestBed.get(HttpService);
  });

  describe('myReviews', () => {
    let resp: MyReviewsData;

    beforeEach(() => {
      const res: ResponseOptions = new ResponseOptions({
        body: JSON.stringify(MY_REVIEWS_RESPONSE),
        headers: new Headers({'x-nextpage': 'init=1'})
      });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));

      service.myReviews(init).subscribe((data: MyReviewsData) => {
        resp = data;
      });
    });
    
    it('should call endpoint', () => {
      expect(http.get).toHaveBeenCalledWith(API_URL_v3_USER, {init: init})
    });

    it('should return an array of reviews', () => {
      expect(resp.data[0]).toEqual(MOCK_REVIEWS[0]);
    });
  });
});