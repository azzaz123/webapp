import { TestBed, inject } from '@angular/core/testing';

import { ReviewService } from './review.service';
import { TEST_HTTP_PROVIDERS } from '../../test/utils';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { CONVERSATION_ID } from '../../test/fixtures/conversation.fixtures';
import { USER_ID } from '../../test/fixtures/user.fixtures';
import { ReviewData } from './review.interface';
import { REVIEW_DATA_BUYER, REVIEW_DATA_SELLER } from '../../test/fixtures/review.fixtures';

let service: ReviewService;
let http: HttpService;

describe('ReviewService', () => {
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

  it('should instanciate', () => {
    expect(service).toBeTruthy();
  });

  describe('check', () => {
    it('should call endpoint and return true', () => {
      let bool: boolean;
      spyOn(http, 'head').and.returnValue(Observable.of({}));
      service.check('1').subscribe((check: boolean) => {
        bool = check;
      });
      expect(http.head).toHaveBeenCalledWith('api/v3/reviews/1');
      expect(bool).toBeTruthy();
    });
    it('should return true', () => {
      let bool: boolean;
      spyOn(http, 'head').and.returnValue(Observable.throw(''));
      service.check('1').subscribe((check: boolean) => {
        bool = check;
      });
      expect(bool).toBeFalsy();
    });
  });

  describe('createAsBuyer', () => {
    it('should call endpoint', () => {
      spyOn(http, 'post').and.returnValue(Observable.of({}));
      service.createAsBuyer(REVIEW_DATA_BUYER).subscribe();
      expect(http.post).toHaveBeenCalledWith('api/v3/reviews/buyer', REVIEW_DATA_BUYER);
    });
  });

  describe('createAsSeller', () => {
    it('should call endpoint', () => {
      spyOn(http, 'post').and.returnValue(Observable.of({}));
      service.createAsSeller(REVIEW_DATA_SELLER).subscribe();
      expect(http.post).toHaveBeenCalledWith('api/v3/reviews/seller', REVIEW_DATA_SELLER);
    });
  });


});
