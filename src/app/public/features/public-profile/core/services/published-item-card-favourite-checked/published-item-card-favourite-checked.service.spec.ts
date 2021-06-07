import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { IsCurrentUserPipeMock } from '@fixtures/is-current-user.fixtures.spec';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { MOCK_PAGINATION_ITEM_RESPONSE } from '@fixtures/item.fixtures.spec';
import { MOCK_USER, MOCK_OTHER_USER } from '@fixtures/user.fixtures.spec';
import { ItemCardsWithPagination } from '@public/core/interfaces/item-card.interface';
import { IsCurrentUserPipe } from '@public/core/pipes/is-current-user/is-current-user.pipe';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { ItemFavouritesModule } from '@public/core/services/item-favourites/item-favourites.module';
import { CookieService } from 'ngx-cookie';
import { of } from 'rxjs';
import { MapPublishedItemCardService } from '../map-published-item-card/map-published-item-card.service';
import { PublicProfileService } from '../public-profile.service';

import { PublishedItemCardFavouriteCheckedService } from './published-item-card-favourite-checked.service';

describe('PublishedItemCardFavouriteCheckedService', () => {
  const MOCK_MAP_PUBLISHED_ITEMS = [MOCK_ITEM_CARD, MOCK_ITEM_CARD, MOCK_ITEM_CARD, MOCK_ITEM_CARD];
  const MOCK_MAP_PUBLISHED_ITEMS_FAVOURITE_CHECK = [MOCK_ITEM_CARD, MOCK_ITEM_CARD];

  const MOCK_NEXT_PAGINATION_ITEM = 2;
  let service: PublishedItemCardFavouriteCheckedService;
  let publicProfileService: PublicProfileService;
  let mapPublishedItemCardService: MapPublishedItemCardService;
  let isCurrentUser: IsCurrentUserPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ItemFavouritesModule],
      providers: [
        PublishedItemCardFavouriteCheckedService,
        {
          provide: PublicProfileService,
          useValue: {
            get user() {
              return MOCK_USER;
            },
            getPublishedItems() {
              return of(MOCK_PAGINATION_ITEM_RESPONSE);
            },
          },
        },
        PublicUserApiService,
        {
          provide: IsCurrentUserPipe,
          useClass: IsCurrentUserPipeMock,
        },
        {
          provide: MapPublishedItemCardService,
          useValue: {
            mapPublishedItems() {
              of(MOCK_MAP_PUBLISHED_ITEMS);
            },
            mapPublishedItemsFavouriteCheck() {
              of(MOCK_MAP_PUBLISHED_ITEMS_FAVOURITE_CHECK);
            },
          },
        },
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    });
    service = TestBed.inject(PublishedItemCardFavouriteCheckedService);
    publicProfileService = TestBed.inject(PublicProfileService);
    mapPublishedItemCardService = TestBed.inject(MapPublishedItemCardService);
    isCurrentUser = TestBed.inject(IsCurrentUserPipe);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when getting the published item cards already favourite checked...', () => {
    describe('and we are the owner of the published items...', () => {
      beforeEach(() => {
        jest.spyOn(publicProfileService, 'user', 'get').mockReturnValue(MOCK_USER);
        spyOn(isCurrentUser, 'transform').and.returnValue(true);
        spyOn(mapPublishedItemCardService, 'mapPublishedItems').and.returnValue(MOCK_MAP_PUBLISHED_ITEMS);
        spyOn(mapPublishedItemCardService, 'mapPublishedItemsFavouriteCheck');
      });

      it('should not ask for the favourite checking and return the correct data', () => {
        let itemCardsWithPagination: ItemCardsWithPagination;

        service.getItems(MOCK_NEXT_PAGINATION_ITEM).subscribe((data) => (itemCardsWithPagination = data));

        expect(mapPublishedItemCardService.mapPublishedItems).toHaveBeenCalled();
        expect(mapPublishedItemCardService.mapPublishedItemsFavouriteCheck).not.toHaveBeenCalled();
        expect(itemCardsWithPagination).toStrictEqual({
          nextPaginationItem: MOCK_PAGINATION_ITEM_RESPONSE.init,
          items: MOCK_MAP_PUBLISHED_ITEMS,
        });
      });
    });

    describe('and we are NOT the owner of the published items...', () => {
      beforeEach(() => {
        jest.spyOn(publicProfileService, 'user', 'get').mockReturnValue(MOCK_OTHER_USER);
        spyOn(isCurrentUser, 'transform').and.returnValue(false);
        spyOn(mapPublishedItemCardService, 'mapPublishedItems');
        spyOn(mapPublishedItemCardService, 'mapPublishedItemsFavouriteCheck').and.returnValue(of(MOCK_MAP_PUBLISHED_ITEMS_FAVOURITE_CHECK));
      });

      it('should ask for the favourite checking and return the correct data', () => {
        let itemCardsWithPagination: ItemCardsWithPagination;

        service.getItems(MOCK_NEXT_PAGINATION_ITEM).subscribe((data) => (itemCardsWithPagination = data));

        expect(mapPublishedItemCardService.mapPublishedItems).not.toHaveBeenCalled();
        expect(mapPublishedItemCardService.mapPublishedItemsFavouriteCheck).toHaveBeenCalled();
        expect(itemCardsWithPagination).toStrictEqual({
          nextPaginationItem: MOCK_PAGINATION_ITEM_RESPONSE.init,
          items: MOCK_MAP_PUBLISHED_ITEMS_FAVOURITE_CHECK,
        });
      });
    });
  });
});
