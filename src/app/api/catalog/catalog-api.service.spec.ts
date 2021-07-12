import { TestBed } from '@angular/core/testing';
import { CatalogApiService } from './catalog-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FavouritesApiService } from '@public/core/services/api/favourites/favourites-api.service';
import {
  catalogItemFixture,
  mappedCatalogItemFixture,
  mappedFavouritedCatalogItemFixture,
  userIdFixture,
} from '../fixtures/catalog/catalog-item.fixtures';
import { PaginatedList } from '../core/model/paginated-list.interface';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { CatalogHttpService } from '@api/catalog/http/catalog-http.service';
import { of } from 'rxjs/internal/observable/of';
import { catalogResponseFixture } from '@api/fixtures/catalog/catalog-response.fixtures';
import { CATALOG_PARAMETERS } from '@api/catalog/http/parameters.enum';

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
        spyOn(httpService, 'getUserPublishedItems').and.returnValue(of(catalogResponseFixture));
        let response: PaginatedList<ItemCard>;

        service.getUserPublishedItems(userIdFixture, false).subscribe((data: PaginatedList<ItemCard>) => {
          response = data;
        });

        expect(httpService.getUserPublishedItems).toHaveBeenCalledTimes(1);
        expect(httpService.getUserPublishedItems).toHaveBeenCalledWith(userIdFixture, undefined);
        expect(response).toEqual({ list: [mappedCatalogItemFixture], paginationParameter: 'nextParameter' });
      });
    });

    describe('with favourites', () => {
      it('should return domain item card formatted published items', () => {
        spyOn(httpService, 'getUserPublishedItems').and.returnValue(of(catalogResponseFixture));
        spyOn(favouritesApiService, 'getFavouriteItemsId').and.returnValue(of([mappedFavouritedCatalogItemFixture.id]));
        let response: PaginatedList<ItemCard>;

        service.getUserPublishedItems(userIdFixture, true).subscribe((data: PaginatedList<ItemCard>) => {
          response = data;
        });

        expect(httpService.getUserPublishedItems).toHaveBeenCalledTimes(1);
        expect(httpService.getUserPublishedItems).toHaveBeenCalledWith(userIdFixture, undefined);
        expect(favouritesApiService.getFavouriteItemsId).toHaveBeenCalledTimes(1);
        expect(favouritesApiService.getFavouriteItemsId).toHaveBeenCalledWith([catalogItemFixture.id]);
        expect(response).toEqual({ list: [mappedFavouritedCatalogItemFixture], paginationParameter: 'nextParameter' });
      });
    });

    describe('with pagination parameter', () => {
      it('should send correct parameters', () => {
        spyOn(httpService, 'getUserPublishedItems').and.returnValue(of(catalogResponseFixture));
        let response: PaginatedList<ItemCard>;

        service.getUserPublishedItems(userIdFixture, false, 'oldNextParameter').subscribe((data: PaginatedList<ItemCard>) => {
          response = data;
        });

        expect(httpService.getUserPublishedItems).toHaveBeenCalledTimes(1);
        expect(httpService.getUserPublishedItems).toHaveBeenCalledWith(userIdFixture, { [CATALOG_PARAMETERS.SINCE]: 'oldNextParameter' });
        expect(response).toEqual({ list: [mappedCatalogItemFixture], paginationParameter: 'nextParameter' });
      });
    });
  });
});
