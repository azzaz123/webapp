import { TestBed } from '@angular/core/testing';
import { CatalogApiService } from './catalog-api.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { FavouritesApiService, CHECK_FAVOURITES_ENDPOINT } from '@public/core/services/api/favourites/favourites-api.service';
import {
  catalogItemFixture,
  mappedCatalogItemFixture,
  mappedFavouritedCatalogItemFixture,
  userIdFixture,
} from '../fixtures/catalog/catalog-item.fixtures';
import { PaginatedList } from '../core/model/paginated-list.interface';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { PUBLISHED_ITEMS_ENDPOINT } from './endpoints';

describe('CatalogApiService', () => {
  let service: CatalogApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogApiService, FavouritesApiService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CatalogApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('when asked to retrieve published items', () => {
    describe('without favourites', () => {
      it('should return domain item card formatted published items', () => {
        let response: PaginatedList<ItemCard>;

        service.getUserPublishedItems(userIdFixture, false).subscribe((data: PaginatedList<ItemCard>) => {
          response = data;
        });

        const publishedItemsRequest: TestRequest = httpMock.expectOne(PUBLISHED_ITEMS_ENDPOINT(userIdFixture));
        publishedItemsRequest.flush({ data: [catalogItemFixture], meta: { next: 'paginationParameter' } });

        httpMock.expectNone(CHECK_FAVOURITES_ENDPOINT);

        expect(response).toEqual({ list: [mappedCatalogItemFixture], paginationParameter: 'paginationParameter' });
        expect(publishedItemsRequest.request.url).toEqual(PUBLISHED_ITEMS_ENDPOINT(userIdFixture));
        expect(publishedItemsRequest.request.method).toBe('GET');
      });
    });

    describe('with favourites', () => {
      it('should return domain item card formatted published items', () => {
        let response: PaginatedList<ItemCard>;

        service.getUserPublishedItems(userIdFixture, true).subscribe((data: PaginatedList<ItemCard>) => {
          response = data;
        });

        const publishedItemsRequest: TestRequest = httpMock.expectOne(PUBLISHED_ITEMS_ENDPOINT(userIdFixture));
        publishedItemsRequest.flush({ data: [catalogItemFixture], meta: { next: 'paginationParameter' } });

        const favouritesRequest: TestRequest = httpMock.expectOne(CHECK_FAVOURITES_ENDPOINT);
        favouritesRequest.flush({ favorites: [mappedFavouritedCatalogItemFixture.id] });

        expect(response).toEqual({ list: [mappedFavouritedCatalogItemFixture], paginationParameter: 'paginationParameter' });
        expect(publishedItemsRequest.request.url).toEqual(PUBLISHED_ITEMS_ENDPOINT(userIdFixture));
        expect(publishedItemsRequest.request.method).toBe('GET');
        expect(favouritesRequest.request.url).toEqual(CHECK_FAVOURITES_ENDPOINT);
        expect(favouritesRequest.request.method).toBe('POST');
      });
    });
  });
});
