import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PublicProfileService } from '../../core/services/public-profile.service';

import { MapPublishedItemCardService } from '../../core/services/map-published-item-card/map-published-item-card.service';

import { UserPublishedComponent } from './user-published.component';
import { By } from '@angular/platform-browser';
import { EmptyStateComponent } from '@public/shared/components/empty-state/empty-state.component';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { ItemCardListComponentStub } from '@fixtures/shared/components/item-card-list.component.stub';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { UuidService } from '@core/uuid/uuid.service';
import { FavoritesApiService } from '@public/core/services/api/favorites/favorites-api.service';
import { PublishedItemCardFavouriteCheckedModule } from '../../core/services/published-item-card-favourite-checked/published-item-card-favourite-checked.module';
import { ItemFavoritesService } from '@public/core/services/item-favorites/item-favorites.service';

describe('UserPublishedComponent', () => {
  let component: UserPublishedComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<UserPublishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PublishedItemCardFavouriteCheckedModule],
      declarations: [UserPublishedComponent, ItemCardListComponentStub, EmptyStateComponent],
      providers: [
        PublicProfileService,
        MapPublishedItemCardService,
        UuidService,
        FavoritesApiService,
        CheckSessionService,
        PublicUserApiService,
        DeviceDetectorService,
        ItemCardService,
        ItemApiService,
        ItemFavoritesService,
        {
          provide: AccessTokenService,
          useValue: {
            accessToken: 'ACCESS_TOKEN',
          },
        },
        { provide: 'SUBDOMAIN', useValue: 'www' },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPublishedComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when component inits', () => {
    const itemCardSelector = 'tsl-public-item-card';

    it('should print same amount of items received', () => {
      const componentItemsLength = component.items.length;
      const domItemsLength = el.querySelectorAll(itemCardSelector).length;

      expect(componentItemsLength).toEqual(domItemsLength);
    });
  });

  describe(`when the user doesn't have items...`, () => {
    it('should show the empty state', () => {
      component.items = [];

      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.directive(EmptyStateComponent));
      expect(emptyState).toBeTruthy();
    });
  });

  describe(`when the user have items...`, () => {
    it('should not show the empty state', () => {
      component.items = [MOCK_ITEM_CARD, MOCK_ITEM_CARD];

      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.directive(EmptyStateComponent));
      expect(emptyState).toBeFalsy();
    });
  });
});
