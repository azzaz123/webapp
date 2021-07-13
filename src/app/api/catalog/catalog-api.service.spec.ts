import { TestBed } from '@angular/core/testing';
import { CatalogApiService } from './catalog-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FavouritesApiService } from '@public/core/services/api/favourites/favourites-api.service';
import { Location, PaginatedList } from '@api/core/model';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { CatalogHttpService } from '@api/catalog/http/catalog-http.service';
import { of } from 'rxjs';
import {
  mappedFavouritedPublishedItemFixture,
  mappedPublishedItemFixture,
  publishedItemFixture,
  userIdFixture,
} from '@api/fixtures/catalog/published/published-item.fixtures';
import { publishedResponseFixture } from '@api/fixtures/catalog/published/published-response.fixtures';
import { PUBLISHED_QUERY_PARAMS, WALL_QUERY_PARAMS } from '@api/catalog/dtos';
import { wallResponseFixture } from '@api/fixtures/catalog/wall/wall-response.fixtures';
import { mappedFavouritedWallItemFixture, mappedWallItemFixture, wallItemFixture } from '@api/fixtures/catalog/wall/wall-item.fixtures';

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

  describe('when asked for wall items', () => {
    const location: Location = {
      longitude: 0,
      latitude: 0,
    };
    describe('without favourites', () => {
      it('should return domain item card formatted wall items', () => {
        spyOn(httpService, 'getWallItems').and.returnValue(of(wallResponseFixture));
        let response: PaginatedList<ItemCard>;

        service.getWallItems(location, false).subscribe((data: PaginatedList<ItemCard>) => {
          response = data;
        });

        expect(httpService.getWallItems).toHaveBeenCalledTimes(1);
        expect(httpService.getWallItems).toHaveBeenCalledWith(location, undefined);
        expect(response).toEqual({ list: [mappedWallItemFixture], paginationParameter: 'nextParameter' });
      });
    });

    describe('with favourites', () => {
      it('should return domain item card formatted wall items', () => {
        spyOn(httpService, 'getWallItems').and.returnValue(of(wallResponseFixture));
        spyOn(favouritesApiService, 'getFavouriteItemsId').and.returnValue(of([mappedFavouritedWallItemFixture.id]));
        let response: PaginatedList<ItemCard>;

        service.getWallItems(location, true).subscribe((data: PaginatedList<ItemCard>) => {
          response = data;
        });

        expect(httpService.getWallItems).toHaveBeenCalledTimes(1);
        expect(httpService.getWallItems).toHaveBeenCalledWith(location, undefined);
        expect(favouritesApiService.getFavouriteItemsId).toHaveBeenCalledTimes(1);
        expect(favouritesApiService.getFavouriteItemsId).toHaveBeenCalledWith([wallItemFixture.id]);
        expect(response).toEqual({ list: [mappedFavouritedWallItemFixture], paginationParameter: 'nextParameter' });
      });
    });

    describe('with pagination parameter', () => {
      it('should send correct parameters', () => {
        spyOn(httpService, 'getWallItems').and.returnValue(of(wallResponseFixture));
        let response: PaginatedList<ItemCard>;

        service.getWallItems(location, false, 'oldNextParameter').subscribe((data: PaginatedList<ItemCard>) => {
          response = data;
        });

        expect(httpService.getWallItems).toHaveBeenCalledTimes(1);
        expect(httpService.getWallItems).toHaveBeenCalledWith(location, {
          [WALL_QUERY_PARAMS.SINCE]: 'oldNextParameter',
        });
        expect(response).toEqual({ list: [mappedWallItemFixture], paginationParameter: 'nextParameter' });
      });
    });
  });
});
