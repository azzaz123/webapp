import {
  HttpClientTestingModule,
  TestRequest,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ItemApiService, MARK_AS_FAVORITE_ENDPOINT } from './item-api.service';

describe('ItemApiService', () => {
  let httpMock: HttpTestingController;
  let itemApiService: ItemApiService;
  const ITEM_ID = '123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemApiService],
      imports: [HttpClientTestingModule],
    });

    itemApiService = TestBed.inject(ItemApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('markAsFavourite', () => {
    it('should mark the selected item as favorite', () => {
      const expectedUrl = MARK_AS_FAVORITE_ENDPOINT(ITEM_ID);
      const expectedBody = {
        favorited: true,
      };

      itemApiService.markAsFavourite(ITEM_ID).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('unmarkAsFavourite', () => {
    it('should unmark the selected item as favorite', () => {
      const expectedUrl = MARK_AS_FAVORITE_ENDPOINT(ITEM_ID);
      const expectedBody = {
        favorited: false,
      };

      itemApiService.unmarkAsFavourite(ITEM_ID).subscribe();
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
    });
  });
});
