import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  GET_ITEM_BUMP_FLAGS,
  GET_ITEM_COUNTERS_ENDPOINT,
  GET_ITEM_ENDPOINT,
  ItemApiService,
  MARK_AS_FAVORITE_ENDPOINT,
} from './item-api.service';

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

  describe('getItem', () => {
    it('should ask for the item', () => {
      const expectedUrl = GET_ITEM_ENDPOINT(ITEM_ID);

      itemApiService.getItem(ITEM_ID).subscribe();
      const req = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getItemCounters', () => {
    it('should ask for the item counters', () => {
      const expectedUrl = GET_ITEM_COUNTERS_ENDPOINT(ITEM_ID);

      itemApiService.getItemCounters(ITEM_ID).subscribe();
      const req = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getBumpFlags', () => {
    it('should ask for the item bump flags', () => {
      const expectedUrl = GET_ITEM_BUMP_FLAGS(ITEM_ID);

      itemApiService.getBumpFlags(ITEM_ID).subscribe();
      const req = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('markAsFavourite', () => {
    it('should mark the selected item as favorite', () => {
      const expectedUrl = MARK_AS_FAVORITE_ENDPOINT(ITEM_ID);
      const expectedBody = {
        favorited: true,
      };

      itemApiService.markAsFavourite(ITEM_ID).subscribe();
      const req = httpMock.expectOne(expectedUrl);
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
      const req = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
    });
  });
});
