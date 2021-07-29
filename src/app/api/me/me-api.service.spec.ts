import { TestBed } from '@angular/core/testing';

import { MeApiService } from './me-api.service';
import { MeHttpService } from '@api/me/http/me-http.service';
import { PaginatedList } from '@api/core/model';
import { Item } from '@core/item/item';
import { of } from 'rxjs';
import { favouriteResponseFixture, mappedFavouriteResponseFixture } from '@api/fixtures/me/favourites/favourite-response.fixture';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MeApiService', () => {
  let service: MeApiService;
  let httpService: MeHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeApiService, MeHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MeApiService);
    httpService = TestBed.inject(MeHttpService);
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
});
