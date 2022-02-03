import { TestBed } from '@angular/core/testing';

import { MeApiService } from './me-api.service';
import { MeHttpService } from '@api/me/http/me-http.service';
import { PaginatedList } from '@api/core/model';
import { Item } from '@core/item/item';
import { of } from 'rxjs';
import { favouriteResponseFixture, mappedFavouriteResponseFixture } from '@api/fixtures/me/favourites/favourite-response.fixture';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ItemService } from '@core/item/item.service';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { mappedSoldItemsResponseFixture, soldItemsResponseFixture } from '@api/fixtures/me/sold/sold-response.fixture';
import { STATUS } from '@private/features/catalog/components/selected-items/selected-product.interface';

describe('MeApiService', () => {
  let service: MeApiService;
  let httpService: MeHttpService;
  let itemService: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MeApiService,
        MeHttpService,
        {
          provide: ItemService,
          useValue: {
            mine() {
              return of({ data: [MOCK_ITEM, MOCK_ITEM] });
            },
          },
        },
      ],
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
      it('should retrieve published items', () => {
        let itemList: PaginatedList<Item>;
        spyOn(itemService, 'mine').and.callThrough();

        service.getItems(null, STATUS.PUBLISHED).subscribe((list: PaginatedList<Item>) => (itemList = list));

        expect(itemService.mine).toHaveBeenCalledTimes(1);
        expect(itemService.mine).toHaveBeenCalledWith(0, STATUS.PUBLISHED);
        expect(itemList).toEqual({ list: [MOCK_ITEM, MOCK_ITEM] });
      });
    });

    describe('with pagination', () => {
      it('should retrieve published items', () => {
        const pagination = '20';
        let itemList: PaginatedList<Item>;
        spyOn(itemService, 'mine').and.returnValue(of({ data: [MOCK_ITEM, MOCK_ITEM], init: pagination }));

        service.getItems(pagination, STATUS.PUBLISHED).subscribe((list: PaginatedList<Item>) => (itemList = list));

        expect(itemService.mine).toHaveBeenCalledTimes(1);
        expect(itemService.mine).toHaveBeenCalledWith(+pagination, STATUS.PUBLISHED);
        expect(itemList).toEqual({ list: [MOCK_ITEM, MOCK_ITEM], paginationParameter: pagination });
      });
    });
  });
});
