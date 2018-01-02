import { TestBed, inject, fakeAsync, async } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { MyReviewsService } from './my-reviews.service';
import { HttpService, TEST_HTTP_PROVIDERS } from 'shield';
import { CategoryService } from '../../core/category/category.service';
import { Observable } from "rxjs/Observable";
import { CATEGORY_DATA_WEB } from "../../../tests/category.fixtures";
import { MyReviewsData } from "./my-reviews-response.interface";
import { MyReviews } from "./my-reviews";
import { MOCK_MY_REVIEWS, MY_REVIEWS_DATA } from "../../../tests/review.fixtures";
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
        ...TEST_HTTP_PROVIDERS,
        {provide: CategoryService, useValue: {
          getCategories: () => {
            return Observable.of(CATEGORY_DATA_WEB);
          }
        }},
      ]
    });
    service = TestBed.get(MyReviewsService);
    http = TestBed.get(HttpService);
  });

  describe('getPaginationReviews', () => {
    let resp: MyReviewsData;
    beforeEach(() => {
      const res: ResponseOptions = new ResponseOptions({
        body: JSON.stringify(MY_REVIEWS_DATA),
        headers: new Headers({'x-nextpage': 'init=1'})
      });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
    });
    it('should return the reviews list', () => {
      service.getPaginationReviews(API_URL_v3_USER, init).subscribe((r: MyReviewsData) => {
        resp = r;
      });

      expect(http.get).toHaveBeenCalledWith(API_URL_v3_USER, {init: init});
    });
  });

  describe('myReviews', () => {
    let resp: MyReviewsData;
    beforeEach(() => {
      const res: ResponseOptions = new ResponseOptions({
        body: JSON.stringify(MY_REVIEWS_DATA),
        headers: new Headers({'x-nextpage': 'init=1'})
      });
      spyOn(http, 'get').and.returnValue(Observable.of(new Response(res)));
    });
    it('should call endpoint', () => {
      service.myReviews(init).subscribe((data: MyReviewsData) => {
        resp = data;
      });

      expect(http.get).toHaveBeenCalledWith(API_URL_v3_USER, {init: init})
    });
    it('should return an array of reviews', () => {
      service.myReviews(init).subscribe((data: MyReviewsData) => {
        resp = data;
      });
      const review = resp.data[0];

      expect(review.item).toEqual(MY_REVIEWS_DATA[0].item);
      expect(review.review).toEqual(MY_REVIEWS_DATA[0].review);
      expect(review.type).toEqual(MY_REVIEWS_DATA[0].type);
      expect(review.user).toEqual(MY_REVIEWS_DATA[0].user);
    });
  });

  describe('mapRecordData', () => {
    it('should map item data', () => {
      const review: MyReviews = service['mapRecordData'](MOCK_MY_REVIEWS);

      expect(review instanceof MyReviews).toBeTruthy();
      expect(review.item).toBe(MOCK_MY_REVIEWS.item);
      expect(review.review).toBe(MOCK_MY_REVIEWS.review);
      expect(review.type).toBe(MOCK_MY_REVIEWS.type);
      expect(review.user).toBe(MOCK_MY_REVIEWS.user);
    });
  });
});
