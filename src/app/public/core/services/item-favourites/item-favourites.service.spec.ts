import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { FavouritesApiService } from '../api/favourites/favourites-api.service';
import { CheckSessionService } from '../check-session/check-session.service';

import { ItemFavouritesService } from './item-favourites.service';

describe('ItemFavouritesService', () => {
  const MOCK_ITEM_IDS = ['23n34ji', '3mjdfi934', '9fnmis34'];
  const MOCK_ITEM_FAVOURITE_IDS = ['23n34ji', '3mjdfi934'];

  let service: ItemFavouritesService;
  let checkSessionService: CheckSessionService;
  let favouritesApiService: FavouritesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ItemFavouritesService,
        {
          provide: CheckSessionService,
          useValue: {
            hasSession() {
              return true;
            },
          },
        },
        {
          provide: FavouritesApiService,
          useValue: {
            getFavouriteItemsId() {
              return of(MOCK_ITEM_FAVOURITE_IDS);
            },
          },
        },
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    });

    service = TestBed.inject(ItemFavouritesService);
    checkSessionService = TestBed.inject(CheckSessionService);
    favouritesApiService = TestBed.inject(FavouritesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when the user have the session active...', () => {
    beforeEach(() => {
      spyOn(checkSessionService, 'hasSession').and.returnValue(true);
    });

    it('should do a petition to get the favourites id', () => {
      spyOn(favouritesApiService, 'getFavouriteItemsId');

      service.getFavouritedItemIds(MOCK_ITEM_IDS);

      expect(favouritesApiService.getFavouriteItemsId).toHaveBeenCalledWith(MOCK_ITEM_IDS);
    });

    it('should return the items from the favourites api service', () => {
      let response: string[];

      service.getFavouritedItemIds(MOCK_ITEM_IDS).subscribe((items) => (response = items));

      expect(response).toEqual(MOCK_ITEM_FAVOURITE_IDS);
    });
  });

  describe(`when the user don't have the session active...`, () => {
    beforeEach(() => {
      spyOn(checkSessionService, 'hasSession').and.returnValue(false);
    });

    it('should not do a petition to get the favourites id', () => {
      spyOn(favouritesApiService, 'getFavouriteItemsId');

      service.getFavouritedItemIds(MOCK_ITEM_IDS);

      expect(favouritesApiService.getFavouriteItemsId).not.toHaveBeenCalled();
    });

    it('should return an empty observable', () => {
      let response: string[];

      service.getFavouritedItemIds(MOCK_ITEM_IDS).subscribe((items) => (response = items));

      expect(response).toEqual([]);
    });
  });
});
