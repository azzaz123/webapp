import { TestBed } from '@angular/core/testing';

import { MeHttpService } from './me-http.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ME_FAVOURITES_ENDPOINT, ME_SOLD_ITEMS_ENDPOINT, ME_PUBLISHED_ITEMS } from '@api/me/http/endpoints';
import { FavouritesResponseDto } from '../dtos/favourites/response/favourites-response-dto';
import { SoldItemResponseDto } from '../dtos/sold/response/sold-response-dto';
import { PublishedResponseDto } from '../dtos/published/response/published-response-dto';

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
      it('should call favorite items url without pagination args', () => {
        let response: FavouritesResponseDto;

        service.getFavourites().subscribe((res) => (response = res));

        httpMock.expectOne(ME_FAVOURITES_ENDPOINT);
      });
    });

    describe('with pagination', () => {
      it('should call favorite items url with pagination args', () => {
        let response: FavouritesResponseDto;

        service.getFavourites({ since: '10' }).subscribe((res) => (response = res));

        httpMock.expectOne(`${ME_FAVOURITES_ENDPOINT}?since=10`);
      });
    });
  });

  describe('when asked to retrieve sold items', () => {
    describe('with no pagination', () => {
      it('should call sold items url without pagination args', () => {
        let response: SoldItemResponseDto;

        service.getSoldItems().subscribe((res) => (response = res));

        httpMock.expectOne(ME_SOLD_ITEMS_ENDPOINT);
      });
    });

    describe('with pagination', () => {
      it('should call sold items url with pagination args', () => {
        let response: SoldItemResponseDto;

        service.getSoldItems({ since: '10' }).subscribe((res) => (response = res));

        httpMock.expectOne(`${ME_SOLD_ITEMS_ENDPOINT}?since=10`);
      });
    });
  });

  describe('when asked to retrieve published items', () => {
    describe('with no pagination', () => {
      it('should call published items url without pagination args', () => {
        let response: PublishedResponseDto;

        service.getPublishedItems().subscribe((res) => (response = res));

        httpMock.expectOne(ME_PUBLISHED_ITEMS);
      });
    });

    describe('with pagination', () => {
      it('should call published items url with pagination args', () => {
        let response: PublishedResponseDto;

        service.getPublishedItems({ since: '10' }).subscribe((res) => (response = res));

        httpMock.expectOne(`${ME_PUBLISHED_ITEMS}?since=10`);
      });
    });
  });
});
