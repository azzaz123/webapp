import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CHECK_FAVOURITES_ENDPOINT, FavouritesApiService } from './favourites-api.service';

describe('FavouritesApiService', () => {
  const MOCK_IDS = ['23bu382', 'sbdsu82329sd'];
  let service: FavouritesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FavouritesApiService],
    });

    service = TestBed.inject(FavouritesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getFavouriteItemsId', () => {
    describe('and the petition succeed...', () => {
      it('should return the favourites', () => {
        let response: string[];

        service.getFavouriteItemsId(MOCK_IDS).subscribe((r) => (response = r));
        const req = httpMock.expectOne(CHECK_FAVOURITES_ENDPOINT);
        req.flush({
          favorites: MOCK_IDS,
        });

        expect(req.request.url).toEqual(CHECK_FAVOURITES_ENDPOINT);
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

        service.getFavouriteItemsId(MOCK_IDS).subscribe((r) => (response = r));
        const req = httpMock.expectOne(CHECK_FAVOURITES_ENDPOINT);
        req.flush(null, { status: 400, statusText: 'Bad Request' });

        expect(req.request.url).toEqual(CHECK_FAVOURITES_ENDPOINT);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({
          ids: MOCK_IDS,
        });
        expect(response).toEqual([]);
      });
    });
  });
});
