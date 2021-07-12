import { TestBed } from '@angular/core/testing';
import { CatalogApiService } from './catalog-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FavouritesApiService } from '@public/core/services/api/favourites/favourites-api.service';
import { PaginatedList } from '../core/model/paginated-list.interface';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { CatalogHttpService } from '@api/catalog/http/catalog-http.service';
import { of } from 'rxjs/internal/observable/of';
import {
  mappedFavouritedPublishedItemFixture,
  mappedPublishedItemFixture,
  publishedItemFixture,
  userIdFixture,
} from '@api/fixtures/catalog/published/published-item.fixtures';
import { publishedResponseFixture } from '@api/fixtures/catalog/published/published-response.fixtures';
import { PUBLISHED_QUERY_PARAMS } from '@api/catalog/dtos';

describe('CatalogApiService', () => {
  let service: CatalogApiService;
  let favouritesApiService: FavouritesApiService;
  let httpService: CatalogHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogApiService, FavouritesApiService, CatalogHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CatalogApiService);
    httpService = TestBed.inject(CatalogHttpService);
    favouritesApiService = TestBed.inject(FavouritesApiService);
  });

  describe('when asked to retrieve published items', () => {
    describe('without favourites', () => {
      it('should return domain item card formatted published items', () => {
        spyOn(httpService, 'getUserPublishedItems').and.returnValue(of(publishedResponseFixture));
        let response: PaginatedList<ItemCard>;

        service.getUserPublishedItems(userIdFixture, false).subscribe((data: PaginatedList<ItemCard>) => {
          response = data;
        });

        expect(httpService.getUserPublishedItems).toHaveBeenCalledTimes(1);
        expect(httpService.getUserPublishedItems).toHaveBeenCalledWith(userIdFixture, undefined);
        expect(response).toEqual({ list: [mappedPublishedItemFixture], paginationParameter: 'nextParameter' });
      });
    });

    describe('with favourites', () => {
      it('should return domain item card formatted published items', () => {
        spyOn(httpService, 'getUserPublishedItems').and.returnValue(of(publishedResponseFixture));
        spyOn(favouritesApiService, 'getFavouriteItemsId').and.returnValue(of([mappedFavouritedPublishedItemFixture.id]));
        let response: PaginatedList<ItemCard>;

        service.getUserPublishedItems(userIdFixture, true).subscribe((data: PaginatedList<ItemCard>) => {
          response = data;
        });

        expect(httpService.getUserPublishedItems).toHaveBeenCalledTimes(1);
        expect(httpService.getUserPublishedItems).toHaveBeenCalledWith(userIdFixture, undefined);
        expect(favouritesApiService.getFavouriteItemsId).toHaveBeenCalledTimes(1);
        expect(favouritesApiService.getFavouriteItemsId).toHaveBeenCalledWith([publishedItemFixture.id]);
        expect(response).toEqual({ list: [mappedFavouritedPublishedItemFixture], paginationParameter: 'nextParameter' });
      });
    });

    describe('with pagination parameter', () => {
      it('should send correct parameters', () => {
        spyOn(httpService, 'getUserPublishedItems').and.returnValue(of(publishedResponseFixture));
        let response: PaginatedList<ItemCard>;

        service.getUserPublishedItems(userIdFixture, false, 'oldNextParameter').subscribe((data: PaginatedList<ItemCard>) => {
          response = data;
        });

        expect(httpService.getUserPublishedItems).toHaveBeenCalledTimes(1);
        expect(httpService.getUserPublishedItems).toHaveBeenCalledWith(userIdFixture, {
          [PUBLISHED_QUERY_PARAMS.SINCE]: 'oldNextParameter',
        });
        expect(response).toEqual({ list: [mappedPublishedItemFixture], paginationParameter: 'nextParameter' });
      });
    });
  });
});
