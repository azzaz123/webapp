import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { FavoritesApiService } from '@public/core/services/api/favorites/favorites-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemFavoritesService } from '@public/core/services/item-favorites/item-favorites.service';
import { CookieService } from 'ngx-cookie';
import { MapPublishedItemCardService } from '../map-published-item-card/map-published-item-card.service';
import { PublicProfileService } from '../public-profile.service';

import { PublishedItemCardFavouriteCheckedService } from './published-item-card-favourite-checked.service';

describe('PublishedItemCardFavouriteCheckedService', () => {
  let service: PublishedItemCardFavouriteCheckedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PublishedItemCardFavouriteCheckedService,
        PublicProfileService,
        PublicUserApiService,
        MapPublishedItemCardService,
        ItemFavoritesService,
        CheckSessionService,
        FavoritesApiService,
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    });
    service = TestBed.inject(PublishedItemCardFavouriteCheckedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
