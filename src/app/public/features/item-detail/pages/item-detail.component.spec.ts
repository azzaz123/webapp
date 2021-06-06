import { DecimalPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AdsService } from '@core/ads/services';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { MOCK_CAR } from '@fixtures/car.fixtures.spec';
import {
  MOCK_EMPTY_ITEM_CARDS_WITH_RECOMMENDED_TYPE,
  MOCK_ITEM_CARD,
  MOCK_ITEM_CARDS_WITH_RECOMMENDED_TYPE,
} from '@fixtures/item-card.fixtures.spec';
import {
  MOCK_CAR_ITEM_DETAIL,
  MOCK_CAR_ITEM_DETAIL_WITHOUT_COUNTER,
  MOCK_CAR_ITEM_DETAIL_WITHOUT_SOCIAL_SHARE,
  MOCK_CAR_ITEM_DETAIL_WITH_VIEWS,
  MOCK_ITEM_DETAIL_FASHION,
  MOCK_ITEM_DETAIL_GBP,
  MOCK_ITEM_DETAIL_WITHOUT_EXTRA_INFO,
  MOCK_ITEM_DETAIL_WITHOUT_ITEM,
  MOCK_ITEM_DETAIL_WITHOUT_LOCATION,
  MOCK_ITEM_DETAIL_WITHOUT_TAXONOMIES,
  MOCK_OTHER_USER_CAR_ITEM_DETAIL,
  MOCK_OTHER_USER_CG_ITEM_DETAIL,
  MOCK_OTHER_USER_REAL_ESTATE_ITEM_DETAIL,
  MOCK_OWN_REAL_ESTATE_ITEM_DETAIL,
} from '@fixtures/item-detail.fixtures.spec';
import { MOCK_ITEM_CAR, MOCK_ITEM_GBP } from '@fixtures/item.fixtures.spec';
import { IsCurrentUserStub } from '@fixtures/public/core';
import { MOCK_REALESTATE } from '@fixtures/realestate.fixtures.spec';
import { DeviceDetectorServiceMock } from '@fixtures/remote-console.fixtures.spec';
import { AdComponentStub } from '@fixtures/shared';
import { MockedUserService, MOCK_OTHER_USER, MOCK_USER, OTHER_USER_ID, USER_ID } from '@fixtures/user.fixtures.spec';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { ItemFavouritesModule } from '@public/core/services/item-favourites/item-favourites.module';
import { MapItemService } from '@public/core/services/map-item/map-item.service';
import { CustomCurrencyPipe } from '@shared/pipes';
import { SOCIAL_SHARE_CHANNELS } from '@shared/social-share/enums/social-share-channels.enum';
import { CookieService } from 'ngx-cookie';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject, of } from 'rxjs';
import { ItemDetailHeaderComponent } from '../components/item-detail-header/item-detail-header.component';
import { ItemDetailHeaderModule } from '../components/item-detail-header/item-detail-header.module';
import { ItemFullScreenCarouselComponent } from '../components/item-fullscreen-carousel/item-fullscreen-carousel.component';
import { ItemSpecificationsComponent } from '../components/item-specifications/item-specifications.component';
import { ItemSpecificationsModule } from '../components/item-specifications/item-specifications.module';
import { ItemTaxonomiesComponent } from '../components/item-taxonomies/item-taxonomies.component';
import { ADS_ITEM_DETAIL, FactoryAdAffiliationSlotConfiguration } from '../core/ads/item-detail-ads.config';
import { EllapsedTimeModule } from '../core/directives/ellapsed-time.module';
import { ItemDetailFlagsStoreService } from '../core/services/item-detail-flags-store/item-detail-flags-store.service';
import { ItemDetailStoreService } from '../core/services/item-detail-store/item-detail-store.service';
import { ItemDetailTrackEventsService } from '../core/services/item-detail-track-events/item-detail-track-events.service';
import { MockItemdDetailTrackEventService, MOCK_ITEM_INDEX } from '../core/services/item-detail-track-events/track-events.fixtures.spec';
import { RECOMMENDATIONS_ENGINE } from '@public/core/services/api/recommender/enums/recomender-type.enum';
import { ItemDetailService } from '../core/services/item-detail/item-detail.service';
import { ItemSocialShareService } from '../core/services/item-social-share/item-social-share.service';
import { MapExtraInfoService } from '../core/services/map-extra-info/map-extra-info.service';
import { MapRecommendedItemCardService } from '../core/services/map-recommended-item-card/map-recommended-item-card.service';
import { RecommenderItemCardFavouriteCheckedService } from '../core/services/recommender-item-card-favourite-checked/recommender-item-card-favourite-checked.service';
import { ItemDetail } from '../interfaces/item-detail.interface';
import { ItemDetailComponent } from './item-detail.component';
import { VisibleDirectiveModule } from '@shared/directives/visible/visible.directive.module';
import { IsCurrentUserPipe } from '@public/core/pipes/is-current-user/is-current-user.pipe';
import { IsCurrentUserPipeMock } from '@fixtures/is-current-user.fixtures.spec';

describe('ItemDetailComponent', () => {
  const mapTag = 'tsl-here-maps';
  const recommendedItemsTag = 'tsl-recommended-items';
  const socialShareTag = 'tsl-social-share';
  const currencies = {
    EUR: '€',
    GBP: '£',
  };
  const itemPriceClass = '.ItemDetail__price';
  const fallbackMapClass = '.ItemDetail__fakeMap';
  const locationClass = '.ItemDetail__location';
  const itemCardClass = '.ItemDetail__card';
  const carExtraInfoClass = '.ItemExtraInfo--car';
  const itemId = '123';

  const itemDetailSubjectMock: BehaviorSubject<ItemDetail> = new BehaviorSubject<ItemDetail>(MOCK_ITEM_DETAIL_GBP);
  const itemDetailStoreServiceMock = {
    itemDetail$: itemDetailSubjectMock.asObservable(),
    toggleReservedItem: () => of(),
    toggleFavouriteItem: () => of({}),
    markItemAsSold: () => {},
    initializeItemAndFlags: () => {},
    clear: () => {},
  };

  let component: ItemDetailComponent;
  let fixture: ComponentFixture<ItemDetailComponent>;
  let mapExtraInfoService: MapExtraInfoService;
  let itemSocialShareService: ItemSocialShareService;
  let deviceService: DeviceService;
  let decimalPipe: DecimalPipe;
  let itemDetailImagesModal: ItemFullScreenCarouselComponent;
  let itemDetailStoreService: ItemDetailStoreService;
  let itemDetailTrackEventsService: ItemDetailTrackEventsService;
  let recommenderItemCardFavouriteCheckedService: RecommenderItemCardFavouriteCheckedService;
  let userService: UserService;
  let de: DebugElement;
  let el: HTMLElement;
  let testAdsService;
  let analyticsService;
  let isCurrentUserPipe: IsCurrentUserPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ItemDetailComponent,
        CustomCurrencyPipe,
        IsCurrentUserStub,
        AdComponentStub,
        ItemSpecificationsComponent,
        ItemTaxonomiesComponent,
        ItemFullScreenCarouselComponent,
      ],
      imports: [
        HttpClientTestingModule,
        ItemSpecificationsModule,
        EllapsedTimeModule,
        ItemDetailHeaderModule,
        ItemFavouritesModule,
        VisibleDirectiveModule,
      ],
      providers: [
        CheckSessionService,
        ItemCardService,
        DecimalPipe,
        ItemApiService,
        ItemFullScreenCarouselComponent,
        Renderer2,
        RecommenderItemCardFavouriteCheckedService,
        MapRecommendedItemCardService,
        ItemDetailService,
        PublicUserApiService,
        RecommenderApiService,
        MapItemService,
        {
          provide: ItemDetailTrackEventsService,
          useClass: MockItemdDetailTrackEventService,
        },
        {
          provide: UserService,
          useClass: MockedUserService,
        },
        {
          provide: AnalyticsService,
          useClass: MockAnalyticsService,
        },
        {
          provide: ItemSocialShareService,
          useValue: {
            initializeItemMetaTags: () => {},
          },
        },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        { provide: SocialMetaTagService, useValue: {} },
        {
          provide: CookieService,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {},
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => itemId,
              },
            },
          },
        },
        {
          provide: AdsService,
          useValue: MockAdsService,
        },
        {
          provide: RecommenderItemCardFavouriteCheckedService,
          useValue: {
            getItems: () => {
              return of(MOCK_ITEM_CARDS_WITH_RECOMMENDED_TYPE);
            },
          },
        },
        {
          provide: ItemDetailStoreService,
          useValue: itemDetailStoreServiceMock,
        },
        {
          provide: ItemDetailFlagsStoreService,
          useValue: {},
        },
        {
          provide: IsCurrentUserPipe,
          useClass: IsCurrentUserPipeMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ItemDetailComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailComponent);
    component = fixture.componentInstance;
    deviceService = TestBed.inject(DeviceService);
    decimalPipe = TestBed.inject(DecimalPipe);
    mapExtraInfoService = TestBed.inject(MapExtraInfoService);
    userService = TestBed.inject(UserService);
    de = fixture.debugElement;
    el = de.nativeElement;
    itemDetailStoreService = TestBed.inject(ItemDetailStoreService);
    itemDetailTrackEventsService = TestBed.inject(ItemDetailTrackEventsService);
    itemDetailImagesModal = TestBed.inject(ItemFullScreenCarouselComponent);
    itemSocialShareService = TestBed.inject(ItemSocialShareService);
    recommenderItemCardFavouriteCheckedService = TestBed.inject(RecommenderItemCardFavouriteCheckedService);
    userService = TestBed.inject(UserService);
    analyticsService = TestBed.inject(AnalyticsService);
    testAdsService = TestBed.inject(AdsService);
    isCurrentUserPipe = TestBed.inject(IsCurrentUserPipe);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we are on MOBILE...', () => {
    beforeEach(() => {
      spyOn(deviceService, 'getDeviceType').and.returnValue(DeviceType.MOBILE);
    });
    it('should only show AD on description', () => {
      fixture.detectChanges();

      const ads = fixture.debugElement.queryAll(By.directive(AdComponentStub));

      expect(ads.length).toBe(5);
    });

    it('should set ads configuration of mobile', () => {
      itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_GBP);
      spyOn(testAdsService, 'setAdKeywords').and.callThrough();
      spyOn(testAdsService, 'setSlots').and.callThrough();

      fixture.detectChanges();

      expect(testAdsService.setAdKeywords).toHaveBeenCalledWith({ category: MOCK_ITEM_DETAIL_GBP.item.categoryId.toString() });
      expect(testAdsService.setSlots).toHaveBeenCalledWith([
        ADS_ITEM_DETAIL.item1,
        ADS_ITEM_DETAIL.item2l,
        ADS_ITEM_DETAIL.item3r,
        ...FactoryAdAffiliationSlotConfiguration(DeviceType.MOBILE),
      ]);
    });
  });

  describe('when we are on TABLET...', () => {
    beforeEach(() => {
      spyOn(deviceService, 'getDeviceType').and.returnValue(DeviceType.TABLET);
    });

    it('should show only the top AD', () => {
      component.ngOnInit();
      fixture.detectChanges();
      const ads = fixture.debugElement.queryAll(By.directive(AdComponentStub));

      expect(ads.length).toBe(5);
    });
    it('should set ads configuration of tablet', () => {
      itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_GBP);
      spyOn(testAdsService, 'setAdKeywords').and.callThrough();
      spyOn(testAdsService, 'setSlots').and.callThrough();

      component.ngOnInit();
      fixture.detectChanges();

      expect(testAdsService.setAdKeywords).toHaveBeenCalledWith({ category: MOCK_ITEM_DETAIL_GBP.item.categoryId.toString() });
      expect(testAdsService.setSlots).toHaveBeenCalledWith([
        ADS_ITEM_DETAIL.item1,
        ADS_ITEM_DETAIL.item2l,
        ADS_ITEM_DETAIL.item3r,
        ...FactoryAdAffiliationSlotConfiguration(DeviceType.TABLET),
      ]);
    });
  });

  describe('when we are on DESKTOP...', () => {
    beforeEach(() => {
      spyOn(deviceService, 'getDeviceType').and.returnValue(DeviceType.DESKTOP);
    });

    it('should show six ADS', () => {
      component.ngOnInit();
      fixture.detectChanges();
      const ads = fixture.debugElement.queryAll(By.directive(AdComponentStub));

      expect(ads.length).toBe(6);
    });
    it('should set ads configuration of desktop', () => {
      itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_GBP);
      spyOn(MockAdsService, 'setAdKeywords').and.callThrough();
      spyOn(MockAdsService, 'setSlots').and.callThrough();

      component.ngOnInit();
      fixture.detectChanges();

      expect(MockAdsService.setAdKeywords).toHaveBeenCalledWith({ category: MOCK_ITEM_DETAIL_GBP.item.categoryId.toString() });
      expect(MockAdsService.setSlots).toHaveBeenCalledWith([
        ADS_ITEM_DETAIL.item1,
        ADS_ITEM_DETAIL.item2l,
        ADS_ITEM_DETAIL.item3r,
        ...FactoryAdAffiliationSlotConfiguration(DeviceType.DESKTOP),
      ]);
    });
  });

  describe('when component inits', () => {
    describe('and we get the item...', () => {
      it('should send view own item detail event if it is the same user', () => {
        itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL);
        spyOn(isCurrentUserPipe, 'transform').and.returnValue(true);
        spyOn(itemDetailTrackEventsService, 'trackViewOwnItemDetail');

        component.ngOnInit();
        fixture.detectChanges();

        expect(itemDetailTrackEventsService.trackViewOwnItemDetail).toHaveBeenCalledWith(
          MOCK_CAR_ITEM_DETAIL.item,
          MOCK_CAR_ITEM_DETAIL.user
        );
      });

      it('should not send view own item detail event if it is not the same user', () => {
        itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL);
        spyOn(isCurrentUserPipe, 'transform').and.returnValue(false);
        spyOn(itemDetailTrackEventsService, 'trackViewOwnItemDetail');

        component.ngOnInit();
        fixture.detectChanges();

        expect(itemDetailTrackEventsService.trackViewOwnItemDetail).not.toHaveBeenCalled();
      });

      it('should send view others real estate event if user is viewing others real estate', () => {
        itemDetailSubjectMock.next(MOCK_OTHER_USER_REAL_ESTATE_ITEM_DETAIL);
        spyOn(isCurrentUserPipe, 'transform').and.returnValue(false);
        spyOn(itemDetailTrackEventsService, 'trackViewOthersItemREDetailEvent');
        spyOn(itemDetailTrackEventsService, 'trackViewOwnItemDetail');

        fixture.detectChanges();

        expect(itemDetailTrackEventsService.trackViewOwnItemDetail).not.toHaveBeenCalled();
        expect(itemDetailTrackEventsService.trackViewOthersItemREDetailEvent).toHaveBeenCalledWith(MOCK_REALESTATE, MOCK_OTHER_USER);
      });

      it('should not send view others real estate event if user is viewing own real estate', () => {
        itemDetailSubjectMock.next(MOCK_OWN_REAL_ESTATE_ITEM_DETAIL);
        spyOn(isCurrentUserPipe, 'transform').and.returnValue(true);
        spyOn(itemDetailTrackEventsService, 'trackViewOthersItemREDetailEvent');
        spyOn(itemDetailTrackEventsService, 'trackViewOwnItemDetail');

        fixture.detectChanges();

        expect(itemDetailTrackEventsService.trackViewOwnItemDetail).toHaveBeenCalledWith(MOCK_REALESTATE, MOCK_USER);
        expect(itemDetailTrackEventsService.trackViewOthersItemREDetailEvent).not.toHaveBeenCalled();
      });

      it('should not send view others real estate event if user is viewing others products that is not real estate', () => {
        itemDetailSubjectMock.next(MOCK_OTHER_USER_CG_ITEM_DETAIL);
        spyOn(isCurrentUserPipe, 'transform').and.returnValue(false);
        spyOn(itemDetailTrackEventsService, 'trackViewOthersItemREDetailEvent');
        spyOn(itemDetailTrackEventsService, 'trackViewOthersCGDetailEvent');

        fixture.detectChanges();

        expect(itemDetailTrackEventsService.trackViewOthersCGDetailEvent).toHaveBeenCalledWith(MOCK_ITEM_GBP, MOCK_OTHER_USER);
        expect(itemDetailTrackEventsService.trackViewOthersItemREDetailEvent).not.toHaveBeenCalled();
      });

      it('should send view others CG item detail event when user is viewing others consumer goods item detail', () => {
        itemDetailSubjectMock.next(MOCK_OTHER_USER_CG_ITEM_DETAIL);
        spyOn(isCurrentUserPipe, 'transform').and.returnValue(false);
        spyOn(itemDetailTrackEventsService, 'trackViewOthersCGDetailEvent');

        fixture.detectChanges();

        expect(itemDetailTrackEventsService.trackViewOthersCGDetailEvent).toHaveBeenCalledWith(MOCK_ITEM_GBP, MOCK_OTHER_USER);
      });

      it('should not send view others CG item detail event when user is not viewing others consumer goods item detail', () => {
        itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL);
        spyOn(isCurrentUserPipe, 'transform').and.returnValue(true);
        spyOn(itemDetailTrackEventsService, 'trackViewOthersCGDetailEvent');

        fixture.detectChanges();

        expect(itemDetailTrackEventsService.trackViewOthersCGDetailEvent).not.toHaveBeenCalledWith();
      });

      it('should not send view others CG item detail event when user is viewing their own consumer goods item detail', () => {
        itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_GBP);
        spyOn(isCurrentUserPipe, 'transform').and.returnValue(true);
        spyOn(itemDetailTrackEventsService, 'trackViewOthersCGDetailEvent');

        fixture.detectChanges();

        expect(itemDetailTrackEventsService.trackViewOthersCGDetailEvent).not.toHaveBeenCalled();
      });

      it('should send view others car event if user is viewing others car', () => {
        itemDetailSubjectMock.next(MOCK_OTHER_USER_CAR_ITEM_DETAIL);
        spyOn(isCurrentUserPipe, 'transform').and.returnValue(false);
        spyOn(itemDetailTrackEventsService, 'trackViewOthersItemCarDetailEvent');
        spyOn(itemDetailTrackEventsService, 'trackViewOwnItemDetail');

        fixture.detectChanges();

        expect(itemDetailTrackEventsService.trackViewOwnItemDetail).not.toHaveBeenCalled();
        expect(itemDetailTrackEventsService.trackViewOthersItemCarDetailEvent).toHaveBeenCalledWith(MOCK_CAR, MOCK_OTHER_USER);
      });

      it('should not send view others car event if user is viewing their own car', () => {
        itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL);
        spyOn(isCurrentUserPipe, 'transform').and.returnValue(true);
        spyOn(itemDetailTrackEventsService, 'trackViewOthersItemCarDetailEvent');
        spyOn(itemDetailTrackEventsService, 'trackViewOwnItemDetail');

        fixture.detectChanges();

        expect(itemDetailTrackEventsService.trackViewOwnItemDetail).toHaveBeenCalledWith(MOCK_ITEM_CAR, MOCK_USER);
        expect(itemDetailTrackEventsService.trackViewOthersItemCarDetailEvent).not.toHaveBeenCalled();
      });

      it('should not send view others car event if user is viewing others prduct that is not a car', () => {
        itemDetailSubjectMock.next(MOCK_OTHER_USER_CG_ITEM_DETAIL);
        spyOn(isCurrentUserPipe, 'transform').and.returnValue(false);
        spyOn(itemDetailTrackEventsService, 'trackViewOthersItemCarDetailEvent');
        spyOn(itemDetailTrackEventsService, 'trackViewOthersCGDetailEvent');

        fixture.detectChanges();

        expect(itemDetailTrackEventsService.trackViewOthersItemCarDetailEvent).not.toHaveBeenCalled();
        expect(itemDetailTrackEventsService.trackViewOthersCGDetailEvent).toHaveBeenCalledWith(MOCK_ITEM_GBP, MOCK_OTHER_USER);
      });

      it('should ask for item data', () => {
        spyOn(itemDetailStoreService, 'initializeItemAndFlags');

        component.ngOnInit();

        expect(itemDetailStoreService.initializeItemAndFlags).toHaveBeenCalledWith(itemId);
      });
    });

    describe('and we NOT get the item...', () => {
      it('should not render the view', () => {
        itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_WITHOUT_ITEM);

        fixture.detectChanges();
        const containerPage = fixture.debugElement.query(By.css(itemCardClass));

        expect(containerPage).toBeFalsy();
      });
    });

    describe('should handle the recommended items...', () => {
      describe('when the item have recommended items...', () => {
        const recommendedIds = '9jd7ryx5odjk,9jd7ryx5odjk,9jd7ryx5odjk,9jd7ryx5odjk';
        const engine = RECOMMENDATIONS_ENGINE.MORE_LIKE_THIS_SOLR;

        beforeEach(() => {
          itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL);
          spyOn(recommenderItemCardFavouriteCheckedService, 'getItems').and.returnValue(of(MOCK_ITEM_CARDS_WITH_RECOMMENDED_TYPE));

          fixture.detectChanges();
        });
        it('should show the recommended items', () => {
          expect(fixture.debugElement.query(By.css(recommendedItemsTag))).toBeTruthy();
        });

        it('should send track view item detail recommendation slider event', () => {
          spyOn(itemDetailTrackEventsService, 'trackViewItemDetailRecommendationSliderEvent');

          const recommendedItems = fixture.debugElement.query(By.css(recommendedItemsTag));

          recommendedItems.triggerEventHandler('initRecommendedItemsSlider', { recommendedItemIds: recommendedIds, engine });
          fixture.detectChanges();

          expect(itemDetailTrackEventsService.trackViewItemDetailRecommendationSliderEvent).toHaveBeenCalledWith(
            MOCK_ITEM_CAR,
            MOCK_USER,
            recommendedIds,
            engine
          );
        });
      });

      describe(`when the item don't have recommended items`, () => {
        beforeEach(() => {
          itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL);
          spyOn(recommenderItemCardFavouriteCheckedService, 'getItems').and.returnValue(of(MOCK_EMPTY_ITEM_CARDS_WITH_RECOMMENDED_TYPE));

          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should NOT show the recommended items', () => {
          expect(fixture.debugElement.query(By.css(recommendedItemsTag))).toBeFalsy();
        });
      });
    });

    describe('should handle the social share info...', () => {
      describe('and we recieve the social share...', () => {
        beforeEach(() => {
          spyOn(itemSocialShareService, 'initializeItemMetaTags');
          itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL);

          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should initialize the item meta tags...', () => {
          expect(itemSocialShareService.initializeItemMetaTags).toHaveBeenCalledWith(MOCK_CAR_ITEM_DETAIL.item);
        });

        it('should show the social share component', () => {
          const socialShareElement = fixture.debugElement.nativeElement.querySelector(socialShareTag);

          Object.keys(MOCK_CAR_ITEM_DETAIL.socialShare).forEach((socialShareKey: string) => {
            expect(socialShareElement[socialShareKey]).toEqual(MOCK_CAR_ITEM_DETAIL.socialShare[socialShareKey]);
          });
        });
      });

      describe(`when we DON'T recieve the social share info...`, () => {
        beforeEach(() => {
          itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL_WITHOUT_SOCIAL_SHARE);

          fixture.detectChanges();
        });

        it('should NOT show the social share component', () => {
          const socialShareElement = fixture.debugElement.query(By.css(socialShareTag));

          expect(socialShareElement).toBeFalsy();
        });
      });

      describe(`when we DON'T recieve the item detail...`, () => {
        beforeEach(() => {
          spyOn(itemSocialShareService, 'initializeItemMetaTags');

          itemDetailSubjectMock.next(null);

          component.ngOnInit();
          fixture.detectChanges();
        });

        it('should NOT initialize the item meta tags...', () => {
          const socialShareElement = fixture.debugElement.query(By.css(socialShareTag));

          expect(itemSocialShareService.initializeItemMetaTags).not.toHaveBeenCalled();
          expect(socialShareElement).toBeFalsy();
        });
      });
    });
  });

  describe('when we have an item...', () => {
    beforeEach(() => {
      itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL);

      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should print their title', () => {
      expect(el.querySelector('.ItemDetail__title').innerHTML).toEqual(MOCK_CAR_ITEM_DETAIL.item.title);
    });

    it('should print their description', () => {
      expect(el.querySelector('.ItemDetail__description').innerHTML).toEqual(MOCK_CAR_ITEM_DETAIL.item.description);
    });

    it('should show the item detail header', () => {
      expect(fixture.debugElement.query(By.css('tsl-item-detail-header'))).toBeTruthy();
    });

    describe('when the favorites and views are NOT defined...', () => {
      it('should show the 0 stat', () => {
        expect(el.querySelector('#favorites').innerHTML).toEqual('0');
        expect(el.querySelector('#views').innerHTML).toEqual('0');
      });
    });

    describe('when the favorites and views are defined...', () => {
      beforeEach(() => {
        itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL_WITH_VIEWS);

        fixture.detectChanges();
      });

      it('should print their favorites stat', () => {
        expect(el.querySelector('#favorites').innerHTML).toEqual(MOCK_CAR_ITEM_DETAIL_WITH_VIEWS.item.favorites.toString());
      });
      it('should print their views stat', () => {
        expect(el.querySelector('#views').innerHTML).toEqual(MOCK_CAR_ITEM_DETAIL_WITH_VIEWS.item.views.toString());
      });
    });

    describe('when the item currency code is in euros...', () => {
      it('should show the price and the euros symbol', () => {
        expect(el.querySelector(itemPriceClass).innerHTML).toEqual(
          `${decimalPipe.transform(MOCK_CAR_ITEM_DETAIL.item.salePrice)}${currencies.EUR}`
        );
      });
    });

    describe('when the item currency code is in dollars...', () => {
      beforeEach(() => {
        itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_GBP);

        fixture.detectChanges();
      });

      it('should show the price and the dollar symbol', () => {
        expect(el.querySelector(itemPriceClass).innerHTML).toEqual(`${currencies.GBP}${decimalPipe.transform(MOCK_ITEM_GBP.salePrice)}`);
      });
    });

    describe('when we click on the carousel image...', () => {
      beforeEach(() => {
        component.itemDetailImagesModal = itemDetailImagesModal;
        spyOn(component.itemDetailImagesModal, 'show');

        const itemImagesCarousel = fixture.debugElement.query(By.css('tsl-item-images-carousel'));
        itemImagesCarousel.triggerEventHandler('imageClick', { index: 4 });

        fixture.detectChanges();
      });

      it('should call to the modal show method', () => {
        expect(component.itemDetailImagesModal.show).toHaveBeenCalled();
      });

      it('should set the images property', () => {
        expect(component.itemDetailImagesModal.images).toStrictEqual(MOCK_CAR_ITEM_DETAIL.bigImages);
      });

      it('should set the item property', () => {
        expect(component.itemDetailImagesModal.item).toBe(MOCK_CAR_ITEM_DETAIL.item);
      });

      it('should set the image index property', () => {
        expect(component.itemDetailImagesModal.imageIndex).toBe(4);
      });
    });
  });

  describe('when we handle the header actions...', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    describe('when we reserve or unreserve an item...', () => {
      it('should call to the store to do the action', () => {
        spyOn(itemDetailStoreService, 'toggleReservedItem').and.returnValue(of());

        const itemDetailHeader = fixture.debugElement.query(By.directive(ItemDetailHeaderComponent));
        itemDetailHeader.triggerEventHandler('reservedItemChange', {});

        fixture.detectChanges();
        expect(itemDetailStoreService.toggleReservedItem).toHaveBeenCalled();
      });
    });

    describe('when we favourite or unfavourite an item...', () => {
      it('should call to the store to do the action and also trigger trackFavouriteOrUnfavouriteEvent in item detail track events service', () => {
        spyOn(itemDetailStoreService, 'toggleFavouriteItem').and.returnValue(of({}));
        spyOn(itemDetailTrackEventsService, 'trackFavouriteOrUnfavouriteEvent');
        const itemDetailHeader = fixture.debugElement.query(By.directive(ItemDetailHeaderComponent));
        itemDetailHeader.triggerEventHandler('favouritedItemChange', {});

        fixture.detectChanges();
        expect(itemDetailStoreService.toggleFavouriteItem).toHaveBeenCalled();
        expect(itemDetailTrackEventsService.trackFavouriteOrUnfavouriteEvent).toHaveBeenCalledWith(
          MOCK_CAR_ITEM_DETAIL.item,
          MOCK_CAR_ITEM_DETAIL.user?.featured
        );
      });
    });

    describe('when we sold an item...', () => {
      it('should call to the store to do the action', () => {
        spyOn(itemDetailStoreService, 'markItemAsSold');

        const itemDetailHeader = fixture.debugElement.query(By.directive(ItemDetailHeaderComponent));
        itemDetailHeader.triggerEventHandler('soldItemChange', {});

        fixture.detectChanges();
        expect(itemDetailStoreService.markItemAsSold).toHaveBeenCalled();
      });
    });
  });

  describe('when we handle the location...', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    describe('when the location is defined', () => {
      describe('and when the map is visible in the browser', () => {
        beforeEach(() => {
          IntersectionObserver['callback']([{ isIntersecting: true }], { unobserve: () => {} });
          fixture.detectChanges();
        });

        it('should show the specified location', () => {
          const map = fixture.debugElement.query(By.css(mapTag));
          const fallbackMap = fixture.debugElement.query(By.css(fallbackMapClass));

          expect(el.querySelector(locationClass).innerHTML).toContain(MOCK_CAR_ITEM_DETAIL.locationSpecifications);
          expect(map).toBeTruthy();
          expect(fallbackMap).toBeFalsy();
        });
      });

      describe('and when the map is NOT visible in the browser', () => {
        beforeEach(() => {
          IntersectionObserver['callback']([{ isIntersecting: false }], { unobserve: () => {} });
          fixture.detectChanges();
        });

        it('should NOT show the specified location', () => {
          fixture.detectChanges();
          const map = fixture.debugElement.query(By.css(mapTag));
          const fallbackMap = fixture.debugElement.query(By.css(fallbackMapClass));

          expect(el.querySelector(locationClass).innerHTML).toContain(MOCK_CAR_ITEM_DETAIL.locationSpecifications);
          expect(map).toBeFalsy();
          expect(fallbackMap).toBeFalsy();
        });
      });
    });

    describe('when the location is NOT defined', () => {
      beforeEach(() => {
        itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_WITHOUT_LOCATION);

        fixture.detectChanges();
      });

      it('should have an undefined location', () => {
        expect(el.querySelector(locationClass).innerHTML).toContain($localize`:@@Undefined:Undefined`);
      });

      describe('and when the map is visible in the browser', () => {
        beforeEach(() => {
          IntersectionObserver['callback']([{ isIntersecting: true }], { unobserve: () => {} });
          fixture.detectChanges();
        });

        it('should show the fallback map', () => {
          const map = fixture.debugElement.query(By.css(mapTag));
          const fallbackMap = fixture.debugElement.query(By.css(fallbackMapClass));

          expect(map).toBeFalsy();
          expect(fallbackMap).toBeTruthy();
        });
      });
    });
  });

  describe('when we handle the item specifications...', () => {
    describe('and the counter specifications are defined...', () => {
      beforeEach(() => {
        itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL);

        fixture.detectChanges();
      });
      it('should show the item specifications...', () => {
        expect(fixture.debugElement.query(By.directive(ItemSpecificationsComponent))).toBeTruthy();
      });
    });

    describe('and the counter specifications are NOT defined...', () => {
      beforeEach(() => {
        itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL_WITHOUT_COUNTER);

        fixture.detectChanges();
      });

      it('should NOT show the item specifications...', () => {
        expect(fixture.debugElement.query(By.directive(ItemSpecificationsComponent))).toBeFalsy();
      });
    });
  });

  describe('when we handle the item extra info...', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });
    describe('and the extra info is defined...', () => {
      it('should be shown the item extra info content', () => {
        const extraInfo = fixture.debugElement.query(By.css('tsl-item-extra-info'));

        expect(extraInfo).toBeTruthy();
      });

      describe('and the item is a car...', () => {
        it('should apply the car specifications style', () => {
          const carExtraInfoStyle = fixture.debugElement.query(By.css(carExtraInfoClass));

          expect(carExtraInfoStyle).toBeTruthy();
        });
      });

      describe('and the item is NOT a car...', () => {
        beforeEach(() => {
          spyOn(mapExtraInfoService, 'mapExtraInfo');
          itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_FASHION);

          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should NOT apply the car specifications style', () => {
          const carExtraInfoStyle = fixture.debugElement.query(By.css(carExtraInfoClass));

          expect(carExtraInfoStyle).toBeFalsy();
          expect(mapExtraInfoService.mapExtraInfo).not.toHaveBeenCalled();
        });
      });
    });

    describe('and we NOT have extra info...', () => {
      beforeEach(() => {
        itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_WITHOUT_EXTRA_INFO);

        fixture.detectChanges();
      });
      it('should NOT be shown the item extra info content', () => {
        const extraInfo = fixture.debugElement.query(By.css('tsl-item-extra-info'));
        const carExtraInfoStyle = fixture.debugElement.query(By.css(carExtraInfoClass));

        expect(carExtraInfoStyle).toBeFalsy();
        expect(extraInfo).toBeFalsy();
      });
    });
  });

  describe('when we handle the item taxonomies...', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    describe('and the taxonomies are defined...', () => {
      it('should show the item specifications...', () => {
        expect(fixture.debugElement.query(By.directive(ItemTaxonomiesComponent))).toBeTruthy();
      });
    });

    describe('and the taxonomies are NOT defined...', () => {
      beforeEach(() => {
        itemDetailSubjectMock.next(MOCK_ITEM_DETAIL_WITHOUT_TAXONOMIES);

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should NOT show the item specifications...', () => {
        expect(fixture.debugElement.query(By.directive(ItemTaxonomiesComponent))).toBeFalsy();
      });
    });
  });

  describe('when we handle the item fullscreen carousel...', () => {
    it('and we favourite the item...', () => {
      spyOn(itemDetailStoreService, 'toggleFavouriteItem').and.returnValue(of());

      const itemDetailHeader = fixture.debugElement.query(By.directive(ItemFullScreenCarouselComponent));
      itemDetailHeader.triggerEventHandler('favouritedItemChange', {});

      fixture.detectChanges();
      expect(itemDetailStoreService.toggleFavouriteItem).toHaveBeenCalled();
    });
  });

  describe('when we click one of the recommened item cards', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should send track click item card event', () => {
      const recommenedItemCard = fixture.debugElement.query(By.css(recommendedItemsTag));
      spyOn(userService, 'get').and.returnValue(of(MOCK_OTHER_USER));
      spyOn(itemDetailTrackEventsService, 'trackClickItemCardEvent');

      recommenedItemCard.triggerEventHandler('clickedItemAndIndexEvent', { itemCard: MOCK_ITEM_CARD, index: MOCK_ITEM_INDEX });

      expect(itemDetailTrackEventsService.trackClickItemCardEvent).toHaveBeenCalled();
    });
  });

  describe('when we handle the social share...', () => {
    itemDetailSubjectMock.next(MOCK_CAR_ITEM_DETAIL);

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should send social share event with facebook channel if we share item with facebook', () => {
      spyOn(itemDetailTrackEventsService, 'trackShareItemEvent');
      const socialShare = fixture.debugElement.query(By.css(socialShareTag));

      socialShare.triggerEventHandler('socialMediaChannel', SOCIAL_SHARE_CHANNELS.FACEBOOK);
      fixture.detectChanges();

      expect(itemDetailTrackEventsService.trackShareItemEvent).toHaveBeenCalledWith(
        SOCIAL_SHARE_CHANNELS.FACEBOOK,
        MOCK_CAR_ITEM_DETAIL.item,
        MOCK_CAR_ITEM_DETAIL.user
      );
    });

    it('should send social share event with twitter channel if we share item with twitter', () => {
      spyOn(itemDetailTrackEventsService, 'trackShareItemEvent');
      const socialShare = fixture.debugElement.query(By.css(socialShareTag));

      socialShare.triggerEventHandler('socialMediaChannel', SOCIAL_SHARE_CHANNELS.TWITTER);
      fixture.detectChanges();

      expect(itemDetailTrackEventsService.trackShareItemEvent).toHaveBeenCalledWith(
        SOCIAL_SHARE_CHANNELS.TWITTER,
        MOCK_CAR_ITEM_DETAIL.item,
        MOCK_CAR_ITEM_DETAIL.user
      );
    });

    it('should send social share event with email channel if we share item with email', () => {
      spyOn(itemDetailTrackEventsService, 'trackShareItemEvent');
      const socialShare = fixture.debugElement.query(By.css(socialShareTag));

      socialShare.triggerEventHandler('socialMediaChannel', SOCIAL_SHARE_CHANNELS.EMAIL);
      fixture.detectChanges();

      expect(itemDetailTrackEventsService.trackShareItemEvent).toHaveBeenCalledWith(
        SOCIAL_SHARE_CHANNELS.EMAIL,
        MOCK_CAR_ITEM_DETAIL.item,
        MOCK_CAR_ITEM_DETAIL.user
      );
    });
  });
});
