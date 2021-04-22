import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MapPublishedItemCardService } from '../../core/services/map-published-item-card/map-published-item-card.service';
import { UserPublishedComponent } from './user-published.component';
import { By } from '@angular/platform-browser';
import { EmptyStateComponent } from '@public/shared/components/empty-state/empty-state.component';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { ItemCardListComponentStub } from '@fixtures/shared/components/item-card-list.component.stub';
import { MOCK_ITEM_CARD, MOCK_ITEM_CARDS_WITH_PAGINATION } from '@fixtures/item-card.fixtures.spec';
import { UuidService } from '@core/uuid/uuid.service';
import { ItemFavouritesModule } from '@public/core/services/item-favourites/item-favourites.module';
import { PublishedItemCardFavouriteCheckedModule } from '../../core/services/published-item-card-favourite-checked/published-item-card-favourite-checked.module';
import { PublishedItemCardFavouriteCheckedService } from '../../core/services/published-item-card-favourite-checked/published-item-card-favourite-checked.service';
import { CookieService } from 'ngx-cookie';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { MockUserService, MOCK_USER } from '@fixtures/user.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { of, throwError } from 'rxjs';
import { MOCK_ITEM_INDEX } from '@public/features/item-detail/core/services/item-detail-track-events/track-events.fixtures.spec';
import { PublicProfileTrackingEventsService } from '../../core/services/public-profile-tracking-events/public-profile-tracking-events.service';
import { MockUserProfileTrackEventService } from '../../core/services/public-profile-tracking-events/public-profile-tracking-events.fixtures.spec';

describe('UserPublishedComponent', () => {
  let component: UserPublishedComponent;
  let de: DebugElement;
  let el: HTMLElement;
  let fixture: ComponentFixture<UserPublishedComponent>;
  let publishedItemCardFavouriteCheckedService: PublishedItemCardFavouriteCheckedService;
  let publicItemCardListTag = 'tsl-public-item-card-list';
  let userService: UserService;
  let publicProfileTrackingEventsService: PublicProfileTrackingEventsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, PublishedItemCardFavouriteCheckedModule, ItemFavouritesModule],
      declarations: [UserPublishedComponent, ItemCardListComponentStub, EmptyStateComponent],
      providers: [
        MapPublishedItemCardService,
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
          provide: PublishedItemCardFavouriteCheckedService,
          useValue: {
            getItems() {
              return of(MOCK_ITEM_CARDS_WITH_PAGINATION);
            },
          },
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
        { provide: 'SUBDOMAIN', useValue: 'www' },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPublishedComponent);
    publishedItemCardFavouriteCheckedService = TestBed.inject(PublishedItemCardFavouriteCheckedService);
    userService = TestBed.inject(UserService);
    publicProfileTrackingEventsService = TestBed.inject(PublicProfileTrackingEventsService);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when component inits', () => {
    describe('and the petition succeed...', () => {
      beforeEach(() => {
        component.items = [];
        spyOn(publishedItemCardFavouriteCheckedService, 'getItems').and.returnValue(of(MOCK_ITEM_CARDS_WITH_PAGINATION));

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should ask for the items', () => {
        expect(publishedItemCardFavouriteCheckedService.getItems).toHaveBeenCalledWith(component.nextPaginationItem);
      });

      it('should set same amount of items received', () => {
        expect(component.items.length).toEqual(MOCK_ITEM_CARDS_WITH_PAGINATION.items.length);
        expect(component.items).toStrictEqual(MOCK_ITEM_CARDS_WITH_PAGINATION.items);
      });
    });

    describe('and the petition fails...', () => {
      beforeEach(() => {
        component.items = [];
        spyOn(publishedItemCardFavouriteCheckedService, 'getItems').and.returnValue(throwError('network error'));

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should ask for the items', () => {
        expect(publishedItemCardFavouriteCheckedService.getItems).toHaveBeenCalledWith(component.nextPaginationItem);
      });

      it('should set an empty array', () => {
        expect(component.items.length).toEqual(0);
        expect(component.items).toStrictEqual([]);
      });
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

    describe('when user toggle favourite icon in the item card', () => {
      let mockItemCard = MOCK_ITEM_CARD;
      beforeEach(() => {
        spyOn(userService, 'get').and.returnValue(of(MOCK_USER));
        spyOn(publicProfileTrackingEventsService, 'trackFavouriteOrUnfavouriteItemEvent');
      });

      it('should send favourite item event if user favourite item', () => {
        mockItemCard.flags.favorite = true;
        let publicItemCardList = fixture.debugElement.query(By.css(publicItemCardListTag));

        publicItemCardList.triggerEventHandler('toggleFavouriteEvent', mockItemCard);

        expect(publicProfileTrackingEventsService.trackFavouriteOrUnfavouriteItemEvent).toHaveBeenCalledWith(mockItemCard, MOCK_USER);
      });

      it('should send unfavourite item event if user unfavourite item', () => {
        mockItemCard.flags.favorite = false;
        let publicItemCardList = fixture.debugElement.query(By.css(publicItemCardListTag));

        publicItemCardList.triggerEventHandler('toggleFavouriteEvent', mockItemCard);

        expect(publicProfileTrackingEventsService.trackFavouriteOrUnfavouriteItemEvent).toHaveBeenCalledWith(mockItemCard, MOCK_USER);
      });
    });
  });

  describe('when the user clicks the item card', () => {
    it('should send click item card event', () => {
      let publicItemCardList = fixture.debugElement.query(By.css(publicItemCardListTag));
      spyOn(publicProfileTrackingEventsService, 'trackClickItemCardEvent');
      spyOn(userService, 'get').and.returnValue(of(MOCK_USER));

      publicItemCardList.triggerEventHandler('clickedItemAndIndex', { itemCard: MOCK_ITEM_CARD, index: MOCK_ITEM_INDEX });
      fixture.detectChanges();

      expect(publicProfileTrackingEventsService.trackClickItemCardEvent).toHaveBeenCalledWith(MOCK_ITEM_CARD, MOCK_USER, MOCK_ITEM_INDEX);
    });
  });
});
