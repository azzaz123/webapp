import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { FavoritesApiService } from '../api/favorites/favorites-api.service';
import { CheckSessionService } from '../check-session/check-session.service';

import { ItemFavoritesService } from './item-favorites.service';

describe('ItemFavoritesService', () => {
  const MOCK_ITEM_IDS = ['23n34ji', '3mjdfi934', '9fnmis34'];
  const MOCK_ITEM_FAVORITE_IDS = ['23n34ji', '3mjdfi934'];

  let service: ItemFavoritesService;
  let checkSessionService: CheckSessionService;
  let favoritesApiService: FavoritesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ItemFavoritesService,
        {
          provide: CheckSessionService,
          useValue: {
            hasSession() {
              return true;
            },
          },
        },
        {
          provide: FavoritesApiService,
          useValue: {
            getFavoriteItemsId() {
              return of(MOCK_ITEM_FAVORITE_IDS);
            },
          },
        },
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    });

    service = TestBed.inject(ItemFavoritesService);
    checkSessionService = TestBed.inject(CheckSessionService);
    favoritesApiService = TestBed.inject(FavoritesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when the user have the session active...', () => {
    beforeEach(() => {
      spyOn(checkSessionService, 'hasSession').and.returnValue(true);
    });

    it('should do a petition to get the favorites id', () => {
      spyOn(favoritesApiService, 'getFavoriteItemsId');

      service.getFavouritedItemIds(MOCK_ITEM_IDS);

      expect(favoritesApiService.getFavoriteItemsId).toHaveBeenCalledWith(MOCK_ITEM_IDS);
    });

    it('should return the items from the favorites api service', () => {
      let response: string[];

      service.getFavouritedItemIds(MOCK_ITEM_IDS).subscribe((items) => (response = items));

      expect(response).toEqual(MOCK_ITEM_FAVORITE_IDS);
    });
  });

  describe(`when the user don't have the session active...`, () => {
    beforeEach(() => {
      spyOn(checkSessionService, 'hasSession').and.returnValue(false);
    });

    it('should not do a petition to get the favorites id', () => {
      spyOn(favoritesApiService, 'getFavoriteItemsId');

      service.getFavouritedItemIds(MOCK_ITEM_IDS);

      expect(favoritesApiService.getFavoriteItemsId).not.toHaveBeenCalled();
    });

    it('should return an empty observable', () => {
      let response: string[];

      service.getFavouritedItemIds(MOCK_ITEM_IDS).subscribe((items) => (response = items));

      expect(response).toEqual([]);
    });
  });
});
