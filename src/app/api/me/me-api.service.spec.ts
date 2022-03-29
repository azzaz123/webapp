import { TestBed } from '@angular/core/testing';
import { MeApiService } from './me-api.service';
import { MeHttpService } from '@api/me/http/me-http.service';
import { PaginatedList } from '@api/core/model';
import { Item } from '@core/item/item';
import { of } from 'rxjs';
import { favouriteResponseFixture, mappedFavouriteResponseFixture } from '@api/fixtures/me/favourites/favourite-response.fixture';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ItemService } from '@core/item/item.service';
import { PURCHASES } from '@fixtures/item.fixtures.spec';
import { mappedSoldItemsResponseFixture, soldItemsResponseFixture } from '@api/fixtures/me/sold/sold-response.fixture';
import { STATUS } from '@private/features/catalog/components/selected-items/selected-product.interface';
import {
  mappedPublishedResponseFixture,
  mappedPublishedResponseWithBumpsFixture,
  publishedResponseFixture,
} from '@api/fixtures/me/published/published-response.fixture';

describe('MeApiService', () => {
  let service: MeApiService;
  let httpService: MeHttpService;
  let itemService: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeApiService, MeHttpService, ItemService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MeApiService);
    httpService = TestBed.inject(MeHttpService);
    itemService = TestBed.inject(ItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked for favourites', () => {
    describe('without pagination', () => {
      it('should retrieve favorites', () => {
        let itemList: PaginatedList<Item>;
        spyOn(httpService, 'getFavourites').and.returnValue(of(favouriteResponseFixture));

        service.getFavourites().subscribe((list: PaginatedList<Item>) => (itemList = list));

        expect(httpService.getFavourites).toHaveBeenCalledTimes(1);
        expect(httpService.getFavourites).toHaveBeenCalledWith(undefined);
        expect(itemList).toEqual(mappedFavouriteResponseFixture);
      });
    });

    describe('with pagination', () => {
      it('should retrieve favorites', () => {
        const pagination = '29';
        let itemList: PaginatedList<Item>;
        spyOn(httpService, 'getFavourites').and.returnValue(of(favouriteResponseFixture));

        service.getFavourites(pagination).subscribe((list: PaginatedList<Item>) => (itemList = list));

        expect(httpService.getFavourites).toHaveBeenCalledTimes(1);
        expect(httpService.getFavourites).toHaveBeenCalledWith({ since: pagination });
        expect(itemList).toEqual(mappedFavouriteResponseFixture);
      });
    });
  });

  describe('when asked for sold items', () => {
    describe('without pagination', () => {
      it('should retrieve sold items', () => {
        let itemList: PaginatedList<Item>;
        spyOn(httpService, 'getSoldItems').and.returnValue(of(soldItemsResponseFixture));

        service.getItems(null, STATUS.SOLD).subscribe((list: PaginatedList<Item>) => (itemList = list));

        expect(httpService.getSoldItems).toHaveBeenCalledTimes(1);
        expect(httpService.getSoldItems).toHaveBeenCalledWith(undefined);
        expect(itemList).toEqual(mappedSoldItemsResponseFixture);
      });
    });

    describe('with pagination', () => {
      it('should retrieve sold items', () => {
        const pagination = '29';
        let itemList: PaginatedList<Item>;
        spyOn(httpService, 'getSoldItems').and.returnValue(of(soldItemsResponseFixture));

        service.getItems(pagination, STATUS.SOLD).subscribe((list: PaginatedList<Item>) => (itemList = list));

        expect(httpService.getSoldItems).toHaveBeenCalledTimes(1);
        expect(httpService.getSoldItems).toHaveBeenCalledWith({ since: pagination });
        expect(itemList).toEqual(mappedSoldItemsResponseFixture);
      });
    });
  });

  describe('when asked for published items', () => {
    describe('without pagination', () => {
      it('should retrieve published items and map purchases info', () => {
        let itemList: PaginatedList<Item>;
        spyOn(httpService, 'getPublishedItems').and.returnValue(of(publishedResponseFixture));
        spyOn(itemService, 'getPurchases').and.returnValue(of([PURCHASES[0]]));

        service.getItems(null, STATUS.PUBLISHED).subscribe((list: PaginatedList<Item>) => (itemList = list));

        expect(httpService.getPublishedItems).toHaveBeenCalledTimes(1);
        expect(httpService.getPublishedItems).toHaveBeenCalledWith(undefined);
        expect(itemList).toEqual(mappedPublishedResponseWithBumpsFixture);
      });

      it('should retrieve published items without purchases info', () => {
        let itemList: PaginatedList<Item>;
        spyOn(httpService, 'getPublishedItems').and.returnValue(of(publishedResponseFixture));
        spyOn(itemService, 'getPurchases').and.returnValue(of([]));

        service.getItems(null, STATUS.PUBLISHED).subscribe((list: PaginatedList<Item>) => (itemList = list));

        expect(httpService.getPublishedItems).toHaveBeenCalledTimes(1);
        expect(httpService.getPublishedItems).toHaveBeenCalledWith(undefined);
        expect(itemList).toEqual(mappedPublishedResponseFixture);
      });
    });

    describe('with pagination', () => {
      it('should retrieve published items and map purchases info', () => {
        const pagination = 'paginationHash';
        let itemList: PaginatedList<Item>;
        spyOn(httpService, 'getPublishedItems').and.returnValue(of(publishedResponseFixture));
        spyOn(itemService, 'getPurchases').and.returnValue(of([PURCHASES[0]]));

        service.getItems(pagination, STATUS.PUBLISHED).subscribe((list: PaginatedList<Item>) => (itemList = list));

        expect(httpService.getPublishedItems).toHaveBeenCalledTimes(1);
        expect(httpService.getPublishedItems).toHaveBeenCalledWith({ since: pagination });
        expect(itemList).toEqual(mappedPublishedResponseWithBumpsFixture);
      });

      it('should retrieve published items without purchases info', () => {
        const pagination = 'paginationHash';
        let itemList: PaginatedList<Item>;
        spyOn(httpService, 'getPublishedItems').and.returnValue(of(publishedResponseFixture));
        spyOn(itemService, 'getPurchases').and.returnValue(of([]));

        service.getItems(pagination, STATUS.PUBLISHED).subscribe((list: PaginatedList<Item>) => (itemList = list));

        expect(httpService.getPublishedItems).toHaveBeenCalledTimes(1);
        expect(httpService.getPublishedItems).toHaveBeenCalledWith({ since: pagination });
        expect(itemList).toEqual(mappedPublishedResponseFixture);
      });
    });
  });
});
