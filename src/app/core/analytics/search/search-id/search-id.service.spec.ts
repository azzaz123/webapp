import { TestBed } from '@angular/core/testing';
import { LOCAL_STORAGE_TOKEN } from '@core/local-storage/local-storage.token';
import { SearchIdRecord } from './interfaces/search-id-record.interface';
import { SearchIdService } from './search-id.service';

describe('SearchIdService', () => {
  let service: SearchIdService;
  let storageMock = global.localStorage;
  const existingItemId = 'item1';
  const randomItemId = 'item0';

  const SEARCH_ID_RECORD_MOCK: SearchIdRecord = {
    item1: {
      searchId: 'searchId1',
      creation: Date.now(),
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchIdService,
        {
          provide: LOCAL_STORAGE_TOKEN,
          useValue: storageMock,
        },
      ],
    });

    service = TestBed.inject(SearchIdService);
  });

  describe('when asking for searchId', () => {
    describe('and no searchIds are stored', () => {
      beforeEach(() => {
        storageMock.removeItem(service['STORAGE_KEY']);
      });

      it('should return no searchId', () => {
        expect(service.getSearchIdByItemId(existingItemId)).toEqual(null);
      });
    });

    describe('and searchIds are stored', () => {
      beforeEach(() => {
        storageMock.setItem(service['STORAGE_KEY'], JSON.stringify(SEARCH_ID_RECORD_MOCK));
      });

      it('should return searchId', () => {
        expect(service.getSearchIdByItemId(existingItemId)).toEqual(SEARCH_ID_RECORD_MOCK[existingItemId].searchId);
      });

      describe('but asked searchId does not have entry', () => {
        it('should return no searchId', () => {
          expect(service.getSearchIdByItemId(randomItemId)).toEqual(null);
        });
      });

      describe('but asked searchId is expired', () => {
        const EXPIRED_SEARCH_ID_RECORD_MOCK = { ...SEARCH_ID_RECORD_MOCK };
        const expiredTime = new Date();
        expiredTime.setHours(expiredTime.getHours() - 3);

        beforeEach(() => {
          EXPIRED_SEARCH_ID_RECORD_MOCK[existingItemId].creation = expiredTime.getTime();
          storageMock.setItem(service['STORAGE_KEY'], JSON.stringify(EXPIRED_SEARCH_ID_RECORD_MOCK));
        });

        it('should return no searchId', () => {
          expect(service.getSearchIdByItemId(existingItemId)).toEqual(null);
        });
      });

      describe('but stored value is not able to be parsed as JSON', () => {
        beforeEach(() => {
          storageMock.setItem(service['STORAGE_KEY'], JSON.stringify('randomString'));
        });

        it('should return no searchId', () => {
          expect(service.getSearchIdByItemId(existingItemId)).toEqual(null);
        });
      });
    });
  });
});
