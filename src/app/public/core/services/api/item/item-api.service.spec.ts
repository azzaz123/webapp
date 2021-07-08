import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ItemCounters, ItemVisibilityFlags } from '@core/item/item-response.interface';
import {
  GET_ITEM_BUMP_FLAGS,
  GET_ITEM_COUNTERS_ENDPOINT,
  GET_ITEM_ENDPOINT,
  GET_ITEM_REMAINING_TIME,
  ItemApiService,
  MARK_AS_FAVORITE_ENDPOINT,
  SET_ITEM_RESERVED,
} from './item-api.service';

describe('ItemApiService', () => {
  let httpMock: HttpTestingController;
  let itemApiService: ItemApiService;

  const ITEM_ID = '123';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemApiService, { provide: LOCALE_ID, useValue: 'en' }],
    });

    itemApiService = TestBed.inject(ItemApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getItem', () => {
    it('should ask for the item', () => {
      const languageParamKey = 'language';
      const languageParamValue = 'en';
      const expectedParams = new HttpParams().set(languageParamKey, languageParamValue);
      const expectedUrl = `${GET_ITEM_ENDPOINT(ITEM_ID)}?${expectedParams.toString()}`;

      itemApiService.getItem(ITEM_ID).subscribe();
      const req = httpMock.expectOne(expectedUrl);
      req.flush({});

      const languageParam = req.request.params.get(languageParamKey);
      expect(req.request.method).toBe('GET');
      expect(languageParam).toEqual(languageParamValue);
    });
  });

  describe('getItemCounters', () => {
    const expectedUrl = GET_ITEM_COUNTERS_ENDPOINT(ITEM_ID);

    it('should ask for the item counters', () => {
      itemApiService.getItemCounters(ITEM_ID).subscribe();
      const req = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });

    describe('when receiving an error from the server', () => {
      it('should return a fake counter object', () => {
        let response: ItemCounters;

        itemApiService.getItemCounters(ITEM_ID).subscribe((r) => (response = r));
        httpMock.expectOne(expectedUrl).error(new ErrorEvent('network error'));

        expect(response.views).toEqual(0);
        expect(response.favorites).toEqual(0);
      });
    });
  });

  describe('getBumpFlags', () => {
    const expectedUrl = GET_ITEM_BUMP_FLAGS(ITEM_ID);

    it('should ask for the item bump flags', () => {
      itemApiService.getBumpFlags(ITEM_ID).subscribe();
      const req = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });

    describe('when receiving an error from the server', () => {
      it('should return a fake visibility flags object', () => {
        let response: ItemVisibilityFlags;

        itemApiService.getBumpFlags(ITEM_ID).subscribe((r) => (response = r));
        httpMock.expectOne(expectedUrl).error(new ErrorEvent('network error'));

        expect(response.bumped).toEqual(false);
        expect(response.highlighted).toEqual(false);
        expect(response.urgent).toEqual(false);
        expect(response.country_bumped).toEqual(false);
        expect(response.boosted).toEqual(false);
      });
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

  describe('deleteItem', () => {
    it('should delete the item', () => {
      const expectedUrl = GET_ITEM_ENDPOINT(ITEM_ID);

      itemApiService.deleteItem(ITEM_ID).subscribe();
      const req = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('DELETE');
    });
  });

  describe('reserveItem', () => {
    it('should mark the selected item as reserved', () => {
      const expectedUrl = SET_ITEM_RESERVED(ITEM_ID);
      const RESERVED = false;
      const expectedBody = {
        reserved: RESERVED,
      };

      itemApiService.reserveItem(ITEM_ID, RESERVED).subscribe();
      const req = httpMock.expectOne(expectedUrl);
      req.flush({});

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.body).toEqual(expectedBody);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('getItemActivePurchases', () => {
    it('should get the active item purchases', () => {
      const expectedUrl = GET_ITEM_REMAINING_TIME(ITEM_ID);

      itemApiService.getItemActivePurchases(ITEM_ID).subscribe();
      const req = httpMock.expectOne(expectedUrl);
      req.flush([]);

      expect(req.request.url).toBe(expectedUrl);
      expect(req.request.method).toBe('GET');
    });
  });
});
