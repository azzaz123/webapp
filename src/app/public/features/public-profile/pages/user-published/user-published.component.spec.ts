import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserPublishedComponent } from './user-published.component';
import { By } from '@angular/platform-browser';
import { EmptyStateComponent } from '@public/shared/components/empty-state/empty-state.component';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { ItemCardListComponentStub } from '@fixtures/shared/components/item-card-list.component.stub';
import { MOCK_ITEM_CARD, MOCK_PAGINATED_CARD_LIST } from '@fixtures/item-card.fixtures.spec';
import { UuidService } from '@core/uuid/uuid.service';
import { ItemFavouritesModule } from '@public/core/services/item-favourites/item-favourites.module';
import { CookieService } from 'ngx-cookie';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { MockUserService, MOCK_USER } from '@fixtures/user.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { of, throwError } from 'rxjs';
import { MOCK_ITEM_INDEX } from '@public/features/item-detail/core/services/item-detail-track-events/track-events.fixtures.spec';
import { PublicProfileTrackingEventsService } from '../../core/services/public-profile-tracking-events/public-profile-tracking-events.service';
import { MockUserProfileTrackEventService } from '../../core/services/public-profile-tracking-events/public-profile-tracking-events.fixtures.spec';
import { CatalogApiModule } from '@api/catalog/catalog-api.module';
import { CatalogApiService } from '@api/catalog/catalog-api.service';
import { ActivatedRoute } from '@angular/router';
import { PUBLIC_PATH_PARAMS } from '@public/public-routing-constants';

@Component({
  selector: 'tsl-test-component',
  template: '<tsl-user-published></tsl-user-published>',
})
class TestComponent {}

describe('UserPublishedComponent', () => {
  const publicItemCardListTag = 'tsl-public-item-card-list';
  const userHashId = 'npj9rd2p8oje';
  let component: UserPublishedComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<TestComponent>;
  let catalogApiService: CatalogApiService;
  let userService: UserService;
  let publicProfileTrackingEventsService: PublicProfileTrackingEventsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ItemFavouritesModule, CatalogApiModule],
      declarations: [TestComponent, UserPublishedComponent, ItemCardListComponentStub, EmptyStateComponent],
      providers: [
        UuidService,
        PublicUserApiService,
        DeviceDetectorService,
        ItemCardService,
        ItemApiService,
        {
          provide: PublicProfileTrackingEventsService,
          useClass: MockUserProfileTrackEventService,
        },
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
        {
          provide: UserService,
          useValue: MockUserService,
        },
        {
          provide: AccessTokenService,
          useValue: {
            accessToken: 'ACCESS_TOKEN',
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: of({ [PUBLIC_PATH_PARAMS.WEBSLUG]: userHashId }),
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    catalogApiService = TestBed.inject(CatalogApiService);
    userService = TestBed.inject(UserService);
    publicProfileTrackingEventsService = TestBed.inject(PublicProfileTrackingEventsService);
    de = fixture.debugElement;
    el = de.nativeElement;
    component = de.query(By.directive(UserPublishedComponent)).componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('when component inits', () => {
    describe('and the petition succeed...', () => {
      beforeEach(() => {
        spyOn(catalogApiService, 'getUserPublishedItems').and.returnValue(of(MOCK_PAGINATED_CARD_LIST));
        fixture.detectChanges();
      });

      it('should ask for the items', () => {
        expect(catalogApiService.getUserPublishedItems).toHaveBeenCalledTimes(1);
        expect(catalogApiService.getUserPublishedItems).toHaveBeenCalledWith(userHashId, true, undefined);
      });

      it('should set same amount of items received', () => {
        expect(component.items.length).toEqual(MOCK_PAGINATED_CARD_LIST.list.length);
        expect(component.items).toStrictEqual(MOCK_PAGINATED_CARD_LIST.list);
      });
    });

    describe('and the petition fails...', () => {
      beforeEach(() => {
        spyOn(catalogApiService, 'getUserPublishedItems').and.returnValue(throwError('network error'));
        fixture.detectChanges();
      });

      it('should ask for the items', () => {
        expect(catalogApiService.getUserPublishedItems).toHaveBeenCalledTimes(1);
        expect(catalogApiService.getUserPublishedItems).toHaveBeenCalledWith(userHashId, true, undefined);
      });

      it('should set an empty array', () => {
        expect(component.items.length).toEqual(0);
        expect(component.items).toStrictEqual([]);
      });
    });
  });

  describe(`when the user doesn't have items...`, () => {
    it('should show the empty state', () => {
      spyOn(catalogApiService, 'getUserPublishedItems').and.returnValue(of({ list: [] }));
      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.directive(EmptyStateComponent));
      expect(emptyState).toBeTruthy();
    });
  });

  describe(`when the user have items...`, () => {
    it('should not show the empty state', () => {
      spyOn(catalogApiService, 'getUserPublishedItems').and.returnValue(of(MOCK_PAGINATED_CARD_LIST));

      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(By.directive(EmptyStateComponent));
      expect(emptyState).toBeFalsy();
    });

    describe('when user toggle favourite icon in the item card', () => {
      const mockItemCard = MOCK_ITEM_CARD;
      beforeEach(() => {
        spyOn(userService, 'get').and.returnValue(of(MOCK_USER));
        spyOn(publicProfileTrackingEventsService, 'trackFavouriteOrUnfavouriteItemEvent');
        fixture.detectChanges();
      });

      it('should send favourite item event if user favourite item', () => {
        mockItemCard.flags.favorite = true;
        const publicItemCardList = fixture.debugElement.query(By.css(publicItemCardListTag));

        publicItemCardList.triggerEventHandler('toggleFavouriteEvent', mockItemCard);

        expect(publicProfileTrackingEventsService.trackFavouriteOrUnfavouriteItemEvent).toHaveBeenCalledWith(mockItemCard, MOCK_USER);
      });

      it('should send unfavourite item event if user unfavourite item', () => {
        mockItemCard.flags.favorite = false;
        const publicItemCardList = fixture.debugElement.query(By.css(publicItemCardListTag));

        publicItemCardList.triggerEventHandler('toggleFavouriteEvent', mockItemCard);

        expect(publicProfileTrackingEventsService.trackFavouriteOrUnfavouriteItemEvent).toHaveBeenCalledWith(mockItemCard, MOCK_USER);
      });
    });
  });

  describe('when the user clicks the item card', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    it('should send click item card event', () => {
      const publicItemCardList = fixture.debugElement.query(By.css(publicItemCardListTag));
      spyOn(publicProfileTrackingEventsService, 'trackClickItemCardEvent');
      spyOn(userService, 'get').and.returnValue(of(MOCK_USER));

      publicItemCardList.triggerEventHandler('clickedItemAndIndex', { itemCard: MOCK_ITEM_CARD, index: MOCK_ITEM_INDEX });
      fixture.detectChanges();

      expect(publicProfileTrackingEventsService.trackClickItemCardEvent).toHaveBeenCalledWith(MOCK_ITEM_CARD, MOCK_ITEM_INDEX, MOCK_USER);
    });
  });
});
