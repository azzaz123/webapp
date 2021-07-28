import { TestBed } from '@angular/core/testing';

import { MeHttpService } from './me-http.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { PublishedResponse } from '@api/catalog/dtos';
import { publishedResponseFixture } from '@api/fixtures/catalog/published/published-response.fixtures';
import { ME_FAVOURITES_ENDPOINT } from '@api/me/http/endpoints';

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
        let response: PublishedResponse;

        service.getFavourites().subscribe((res: PublishedResponse) => (response = res));

        const req: TestRequest = httpMock.expectOne(ME_FAVOURITES_ENDPOINT);
        req.flush(publishedResponseFixture);

        expect(response).toEqual(publishedResponseFixture);
      });
    });

    describe('with pagination', () => {
      it('should retrieve favourites', () => {
        let response: PublishedResponse;

        service.getFavourites({ since: '10' }).subscribe((res: PublishedResponse) => (response = res));

        const req: TestRequest = httpMock.expectOne(`${ME_FAVOURITES_ENDPOINT}?since=10`);
        req.flush(publishedResponseFixture);

        expect(response).toEqual(publishedResponseFixture);
      });
    });
  });
});
