import { TestBed } from '@angular/core/testing';
import { ReviewService, REVIEWS_API_URL } from './review.service';
import { REVIEW_DATA_BUYER, REVIEW_DATA_SELLER } from '../../../tests/review.fixtures.spec';
import { HttpTestingController, HttpClientTestingModule, TestRequest } from '@angular/common/http/testing';
import { USER_ID } from '../../../tests/user.fixtures.spec';
import { environment } from '../../../environments/environment';
import 'rxjs/add/observable/throw';

let service: ReviewService;
let httpMock: HttpTestingController;

describe('ReviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReviewService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.get(ReviewService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('check', () => {
    it('should return true if response is OK', () => {
      const expectedUrl = `${environment.baseUrl}${REVIEWS_API_URL}/${USER_ID}`;
      let response: boolean;

      service.check(USER_ID).subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(response).toBe(true);
    });

    it('should return false if there is an error', () => {
      const expectedUrl = `${environment.baseUrl}${REVIEWS_API_URL}/${USER_ID}`;
      let response: boolean;

      service.check(USER_ID).subscribe(r => response = r);
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.error(new ErrorEvent('Error when getting reviews'))

      expect(response).toBe(false);
    });
  });

  describe('createAsBuyer', () => {
    it('should call endpoint', () => {
      const expectedUrl = `${environment.baseUrl}${REVIEWS_API_URL}/buyer`;

      service.createAsBuyer(REVIEW_DATA_BUYER).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(REVIEW_DATA_BUYER);
      expect(req.request.method).toBe('POST');
    });
  });

  describe('createAsSeller', () => {
    it('should call endpoint', () => {
      const expectedUrl = `${environment.baseUrl}${REVIEWS_API_URL}/seller`;

      service.createAsSeller(REVIEW_DATA_SELLER).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(REVIEW_DATA_SELLER);
      expect(req.request.method).toBe('POST');
    });
  });

});
