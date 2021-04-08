import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GET_FAVORITES } from './favorites-api.service';
import { FavoritesApiService } from './favorites-api.service';

describe('FavoritesApiService', () => {
  let service: FavoritesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FavoritesApiService],
    });

    service = TestBed.inject(FavoritesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getItem', () => {
    it('should ask for the item', () => {
      const ids = ['i23nj2', '23hiu2hei'];
      const paramKey = 'ids';
      const expectedParams = new HttpParams().set(paramKey, ids.toString());
      const expectedUrl = `${GET_FAVORITES}?${expectedParams.toString()}`;

      service.getFavoriteItemsId(ids).subscribe();
      const req = httpMock.expectOne(expectedUrl);
      req.flush({});

      const param = req.request.params.get(paramKey);
      expect(req.request.method).toBe('GET');
      expect(param).toEqual(ids);
    });
  });
});
