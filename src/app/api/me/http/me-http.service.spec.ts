import { TestBed } from '@angular/core/testing';

import { MeHttpService } from './me-http.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { publishedResponseFixture } from '@api/fixtures/catalog/published/published-response.fixtures';
import { ME_FAVOURITES_ENDPOINT } from '@api/me/http/endpoints';
import { FavouritesResponseDto } from '../dtos/favourites/response/favourites-response-dto';

describe('MeHttpService', () => {
  let service: MeHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MeHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked to retrieve favourites', () => {
    describe('with no pagination', () => {
      it('should retrieve favourites', () => {
        let response: FavouritesResponseDto;

        service.getFavourites().subscribe((res) => (response = res));

        const req: TestRequest = httpMock.expectOne(ME_FAVOURITES_ENDPOINT);
        req.flush(publishedResponseFixture);

        expect(response).toEqual(publishedResponseFixture);
      });
    });

    describe('with pagination', () => {
      it('should retrieve favourites', () => {
        let response: FavouritesResponseDto;

        service.getFavourites({ since: '10' }).subscribe((res) => (response = res));

        const req: TestRequest = httpMock.expectOne(`${ME_FAVOURITES_ENDPOINT}?since=10`);
        req.flush(publishedResponseFixture);

        expect(response).toEqual(publishedResponseFixture);
      });
    });
  });
});
