import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { GET_FAVORITES } from './favorites-api.service';
import { FavoritesApiService } from './favorites-api.service';

describe('FavoritesApiService', () => {
  const MOCK_IDS = ['23bu382', 'sbdsu82329sd'];
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

  describe('getFavoriteItemsId', () => {
    describe('and the petition succeed...', () => {
      it('should return the favorites', () => {
        let response: string[];

        service.getFavoriteItemsId(MOCK_IDS).subscribe((r) => (response = r));
        const req = httpMock.expectOne(GET_FAVORITES);
        req.flush({
          favorites: MOCK_IDS,
        });

        expect(req.request.url).toEqual(GET_FAVORITES);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
          ids: MOCK_IDS,
        });
        expect(response).toEqual(MOCK_IDS);
      });
    });

    describe('and the petition fails...', () => {
      it('should return an empty array', () => {
        let response: string[];

        service.getFavoriteItemsId(MOCK_IDS).subscribe((r) => (response = r));
        const req = httpMock.expectOne(GET_FAVORITES);
        req.flush(null, { status: 400, statusText: 'Bad Request' });

        expect(req.request.url).toEqual(GET_FAVORITES);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
          ids: MOCK_IDS,
        });
        expect(response).toEqual([]);
      });
    });
  });
});
