import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { CookieService } from 'ngx-cookie';
import { FavoritesApiService } from '../api/favorites/favorites-api.service';
import { CheckSessionService } from '../check-session/check-session.service';

import { ItemFavoritesService } from './item-favorites.service';

describe('ItemFavoritesService', () => {
  let service: ItemFavoritesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ItemFavoritesService,
        CheckSessionService,
        FavoritesApiService,
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
      ],
    });
    service = TestBed.inject(ItemFavoritesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
