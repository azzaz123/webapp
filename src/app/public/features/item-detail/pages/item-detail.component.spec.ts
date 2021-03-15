import { DecimalPipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AdsService } from '@core/ads/services';
import { CategoryService } from '@core/category/category.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { MOCK_CAR } from '@fixtures/car.fixtures.spec';
import {
  ITEM_CELLPHONES_EXTRA_INFO,
  ITEM_CELLPHONES_EXTRA_INFO_PARENT_OBJECT_TYPE,
  MOCK_ITEM,
  MOCK_ITEM_CAR,
  MOCK_ITEM_CELLPHONES,
  MOCK_ITEM_CELLPHONES_NO_SUBCATEGORY,
  MOCK_ITEM_CELLPHONES_PARENT_SUBCATEGORY,
  MOCK_ITEM_FASHION,
  MOCK_ITEM_GBP,
  MOCK_ITEM_WITHOUT_LOCATION,
} from '@fixtures/item.fixtures.spec';
import { MOCK_COUNTER_SPECIFICATIONS_CAR, MOCK_COUNTER_SPECIFICATIONS_REAL_ESTATE } from '@fixtures/map-specifications.fixtures.spec';
import { IsCurrentUserStub } from '@fixtures/public/core';
import { MOCK_REALESTATE } from '@fixtures/realestate.fixtures.spec';
import { DeviceDetectorServiceMock } from '@fixtures/remote-console.fixtures.spec';
import { AdComponentStub } from '@fixtures/shared';
import { MOCK_FULL_USER_FEATURED, MOCK_USER } from '@fixtures/user.fixtures.spec';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { TypeCheckService } from '@public/core/services/type-check/type-check.service';
import {
  EMPTY_RECOMMENDED_ITEMS_MOCK,
  RECOMMENDED_ITEMS_MOCK,
} from '@public/features/item-detail/components/recommended-items/constants/recommended-items.fixtures.spec';
import { MapItemService } from '@public/features/public-profile/pages/user-published/services/map-item/map-item.service';
import { CustomCurrencyPipe } from '@shared/pipes';
import { APP_PATHS } from 'app/app-routing-constants';
import { CookieService } from 'ngx-cookie';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of, throwError } from 'rxjs';
import { ItemFullScreenCarouselComponent } from '../components/item-fullscreen-carousel/item-fullscreen-carousel.component';
import { ItemSpecificationsComponent } from '../components/item-specifications/item-specifications.component';
import { ItemSpecificationsModule } from '../components/item-specifications/item-specifications.module';
import { ItemTaxonomiesComponent } from '../components/item-taxonomies/item-taxonomies.component';
import { ItemTaxonomiesModule } from '../components/item-taxonomies/item-taxonomies.module';
import { ADS_ITEM_DETAIL } from '../core/ads/item-detail-ads.config';
import { EllapsedTimeModule } from '../core/directives/ellapsed-time.module';
import { ItemDetailStoreService } from '../core/services/item-detail-store/item-detail-store.service';
import { ItemDetailService } from '../core/services/item-detail/item-detail.service';
import { MapExtraInfoService } from '../core/services/map-extra-info/map-extra-info.service';
import { MapSpecificationsService } from '../core/services/map-specifications/map-specifications.service';
import { ItemDetailComponent } from './item-detail.component';

describe('ItemDetailComponent', () => {
  const mapTag = 'tsl-here-maps';
  const recommendedItemsTag = 'tsl-recommended-items';
  const currencies = {
    EUR: '€',
    GBP: '£',
  };
  const itemPriceClass = '.ItemDetail__price';
  const fallbackMapClass = '.ItemDetail__fakeMap';
  const locationClass = '.ItemDetail__location';
  const itemContentClass = '.ItemDetail__content';
  const carExtraInfoClass = '.ItemExtraInfo--car';
  const itemId = '123';

  const MOCK_ICON = '/patch/icon.svg';
  const MOCK_ITEM_DETAIL = {
    item: MOCK_CAR,
    user: MOCK_FULL_USER_FEATURED,
  };

  let component: ItemDetailComponent;
  let fixture: ComponentFixture<ItemDetailComponent>;
  let itemDetailService: ItemDetailService;
  let mapExtraInfoService: MapExtraInfoService;
  let typeCheckService: TypeCheckService;
  let deviceService: DeviceService;
  let categoryService: CategoryService;
  let decimalPipe: DecimalPipe;
  let itemDetailImagesModal: ItemFullScreenCarouselComponent;
  let router: Router;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemDetailComponent, CustomCurrencyPipe, IsCurrentUserStub, AdComponentStub],
      imports: [HttpClientTestingModule, ItemSpecificationsModule, EllapsedTimeModule, ItemTaxonomiesModule],
      providers: [
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        {
          provide: CookieService,
          useValue: {},
        },
        DecimalPipe,
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
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
        {
          provide: AdsService,
          useValue: MockAdsService,
        },
        ItemDetailService,
        ItemApiService,
        PublicUserApiService,
        RecommenderApiService,
        {
          provide: ItemDetailService,
          useValue: {
            getItem: () => {
              return of(MOCK_ITEM_DETAIL);
            },
            getRecommendedItems: () => {
              return of(RECOMMENDED_ITEMS_MOCK);
            },
          },
        },
        {
          provide: MapSpecificationsService,
          useValue: {
            mapCarSpecifications: () => {
              return MOCK_COUNTER_SPECIFICATIONS_CAR;
            },
            mapRealestateSpecifications: () => {
              return MOCK_COUNTER_SPECIFICATIONS_REAL_ESTATE;
            },
          },
        },
        {
          provide: MapExtraInfoService,
          useValue: {
            mapExtraInfo: () => {
              return ['IPhone 12'];
            },
          },
        },
        MapItemService,
        SocialMetaTagService,
        {
          TypeCheckService,
          useValue: {
            isCar: () => {
              return false;
            },
          },
        },
        ItemFullScreenCarouselComponent,
        CheckSessionService,
        ItemCardService,
        Renderer2,
        ItemDetailStoreService,
        CategoryService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailComponent);
    component = fixture.componentInstance;
    deviceService = TestBed.inject(DeviceService);
    decimalPipe = TestBed.inject(DecimalPipe);
    itemDetailService = TestBed.inject(ItemDetailService);
    de = fixture.debugElement;
    el = de.nativeElement;
    router = TestBed.inject(Router);
    itemDetailService = TestBed.inject(ItemDetailService);
    typeCheckService = TestBed.inject(TypeCheckService);
    mapExtraInfoService = TestBed.inject(MapExtraInfoService);
    itemDetailImagesModal = TestBed.inject(ItemFullScreenCarouselComponent);
    categoryService = TestBed.inject(CategoryService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we are on MOBILE...', () => {
    it('should only show AD on description', () => {
      spyOn(deviceService, 'getDeviceType').and.returnValue(DeviceType.MOBILE);

      component.ngOnInit();
      fixture.detectChanges();

      const ads = fixture.debugElement.queryAll(By.directive(AdComponentStub));

      expect(ads.length).toBe(2);
    });
  });

  describe('when we are on TABLET...', () => {
    it('should show only the top AD', () => {
      spyOn(deviceService, 'getDeviceType').and.returnValue(DeviceType.TABLET);

      component.ngOnInit();
      fixture.detectChanges();
      const ads = fixture.debugElement.queryAll(By.directive(AdComponentStub));

      expect(ads.length).toBe(2);
    });
  });

  describe('when we are on DESKTOP...', () => {
    it('should show the three ADS', () => {
      spyOn(deviceService, 'getDeviceType').and.returnValue(DeviceType.DESKTOP);

      component.ngOnInit();
      fixture.detectChanges();
      const ads = fixture.debugElement.queryAll(By.directive(AdComponentStub));

      expect(ads.length).toBe(3);
    });
  });

  describe('when the location is defined', () => {
    it('should show the specified location', () => {
      const map = fixture.debugElement.query(By.css(mapTag));
      const fallbackMap = fixture.debugElement.query(By.css(fallbackMapClass));

      expect(el.querySelector(locationClass).innerHTML).toContain(component.locationSpecifications);
      expect(component.locationHaveCoordinates()).toBe(true);
      expect(map).toBeTruthy();
      expect(fallbackMap).toBeFalsy();
    });

    describe('when the item have location...', () => {
      beforeEach(() => {
        component.itemDetail.item = MOCK_ITEM;
        fixture.detectChanges();
      });
      it('the location showed should be the item one', () => {
        const itemLocation = {
          zip: component.itemDetail.item.location.zip,
          city: component.itemDetail.item.location.city,
          latitude: component.itemDetail.item.location.approximated_latitude,
          longitude: component.itemDetail.item.location.approximated_longitude,
        };

        expect(component.itemLocation).toStrictEqual(itemLocation);
      });
    });

    describe('when the item NOT have location...', () => {
      beforeEach(() => {
        component.itemDetail.item = MOCK_ITEM_WITHOUT_LOCATION;
        component.itemDetail.user = MOCK_USER;

        fixture.detectChanges();
      });

      it('the location showed should be the user one', () => {
        const userLocation = {
          zip: MOCK_USER.location.zip,
          city: MOCK_USER.location.city,
          latitude: MOCK_USER.location.approximated_latitude,
          longitude: MOCK_USER.location.approximated_longitude,
        };

        expect(component.itemLocation).toStrictEqual(userLocation);
      });
    });
  });

  describe('when the location is NOT defined', () => {
    beforeEach(() => {
      component.itemLocation = null;
      component.itemDetail.item = MOCK_ITEM_WITHOUT_LOCATION;

      fixture.detectChanges();
    });

    it('should have an undefined location', () => {
      expect(component.itemLocation).toBe(null);
      expect(component.locationHaveCoordinates()).toBe(false);
      expect(el.querySelector(locationClass).innerHTML).toContain(component.locationSpecifications);
    });

    it('should show the fallback map', () => {
      const map = fixture.debugElement.query(By.css(mapTag));
      const fallbackMap = fixture.debugElement.query(By.css(fallbackMapClass));

      expect(map).toBeFalsy();
      expect(component.locationHaveCoordinates()).toBe(false);
      expect(fallbackMap).toBeTruthy();
    });
  });

  describe('when component inits', () => {
    describe('and we get the item...', () => {
      it('should ask for item data', () => {
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.itemDetail).toBe(MOCK_ITEM_DETAIL);
      });

      it('should set social share data correctly', () => {
        const socialShareSelector = 'tsl-social-share';

        component.ngOnInit();
        fixture.detectChanges();

        const socialShareElement = el.querySelector(socialShareSelector);
        Object.keys(component.socialShare).forEach((socialShareKey: string) => {
          expect(socialShareElement[socialShareKey]).toEqual(component.socialShare[socialShareKey]);
        });
      });

      it('should set ads configuration', () => {
        spyOn(MockAdsService, 'setAdKeywords').and.callThrough();
        spyOn(MockAdsService, 'setSlots').and.callThrough();

        component.ngOnInit();
        fixture.detectChanges();

        expect(MockAdsService.setAdKeywords).toHaveBeenCalledWith({ category: MOCK_ITEM_DETAIL.item.categoryId.toString() });
        expect(MockAdsService.setSlots).toHaveBeenCalledWith([ADS_ITEM_DETAIL.item1, ADS_ITEM_DETAIL.item2l, ADS_ITEM_DETAIL.item3r]);
      });
    });

    describe('and we NOT get the item...', () => {
      beforeEach(() => {
        component.itemDetail = null;
      });
      it('should redirect to the not found page', () => {
        spyOn(itemDetailService, 'getItem').and.returnValue(throwError(''));
        spyOn(router, 'navigate');

        component.ngOnInit();
        fixture.detectChanges();
        const containerPage = fixture.debugElement.query(By.css(itemContentClass));

        expect(containerPage).toBeFalsy();
        expect(router.navigate).toHaveBeenCalledWith([`/${APP_PATHS.NOT_FOUND}`]);
      });
    });
  });

  describe('when we have an item...', () => {
    beforeEach(() => {
      component.itemDetail = MOCK_ITEM_DETAIL;
    });

    it('should print their title', () => {
      expect(el.querySelector('.ItemDetail__title').innerHTML).toEqual(component.itemDetail.item.title);
    });

    it('should print their description', () => {
      expect(el.querySelector('.ItemDetail__description').innerHTML).toEqual(component.itemDetail.item.description);
    });

    describe('when the favorites and views are NOT defined...', () => {
      it('should show the 0 stat', () => {
        expect(el.querySelector('#favorites').innerHTML).toEqual('0');
        expect(el.querySelector('#views').innerHTML).toEqual('0');
      });
    });

    describe('when the favorites and views are defined...', () => {
      beforeEach(() => {
        component.itemDetail.item.favorites = 3;
        component.itemDetail.item.views = 5;
        fixture.detectChanges();
      });

      it('should print their favorites stat', () => {
        expect(el.querySelector('#favorites').innerHTML).toEqual(component.itemDetail.item.favorites.toString());
      });
      it('should print their views stat', () => {
        expect(el.querySelector('#views').innerHTML).toEqual(component.itemDetail.item.views.toString());
      });
    });

    describe('when the item currency code is in euros...', () => {
      it('should show the price and the euros symbol', () => {
        expect(el.querySelector(itemPriceClass).innerHTML).toEqual(
          `${decimalPipe.transform(component.itemDetail.item.salePrice)}${currencies.EUR}`
        );
      });
    });

    describe('when the item currency code is in dollars...', () => {
      beforeEach(() => {
        component.itemDetail.item = MOCK_ITEM_GBP;
        fixture.detectChanges();
      });
      it('should show the price and the dollar symbol', () => {
        expect(el.querySelector(itemPriceClass).innerHTML).toEqual(
          `${currencies.GBP}${decimalPipe.transform(component.itemDetail.item.salePrice)}`
        );
      });
    });

    describe('and the item is a category with recommendation...', () => {
      describe('when is a fashion accesory...', () => {
        beforeEach(() => {
          component.itemDetail.item = MOCK_ITEM_FASHION;
          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should show the recommended items', () => {
          expect(fixture.debugElement.query(By.css(recommendedItemsTag))).toBeTruthy();
        });
      });

      describe('when is a car...', () => {
        beforeEach(() => {
          component.itemDetail.item = MOCK_ITEM_CAR;
          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should show the recommended items', () => {
          expect(fixture.debugElement.query(By.css(recommendedItemsTag))).toBeTruthy();
        });
      });

      describe('but NOT have recommended items...', () => {
        beforeEach(() => {
          spyOn(itemDetailService, 'getRecommendedItems').and.returnValue(of(EMPTY_RECOMMENDED_ITEMS_MOCK));
          component.itemDetail.item = MOCK_ITEM_CAR;
          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should NOT show the recommended items', () => {
          expect(fixture.debugElement.query(By.css(recommendedItemsTag))).toBeFalsy();
        });
      });
    });

    describe('and the item is NOT a fashion accesories or a car', () => {
      beforeEach(() => {
        component.itemDetail.item = MOCK_ITEM_CELLPHONES;
        component.ngOnInit();
        fixture.detectChanges();
      });
      it('should NOT show the recommended items', () => {
        expect(fixture.debugElement.query(By.css(recommendedItemsTag))).toBeFalsy();
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
        expect(component.itemDetailImagesModal.images).toBe(component.bigImages);
      });

      it('should set the item property', () => {
        expect(component.itemDetailImagesModal.item).toBe(component.itemDetail.item);
      });

      it('should set the image index property', () => {
        expect(component.itemDetailImagesModal.imageIndex).toBe(4);
      });
    });

    it('should show the item detail header', () => {
      expect(fixture.debugElement.query(By.css('tsl-item-detail-header'))).toBeTruthy();
    });
  });

  describe('when we handle the item specifications...', () => {
    describe('when the item is a car ...', () => {
      beforeEach(() => {
        component.itemDetail.item = MOCK_CAR;
        component.itemSpecifications = null;

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should show the item specifications...', () => {
        expect(fixture.debugElement.query(By.directive(ItemSpecificationsComponent))).toBeTruthy();
      });

      it('should be typed as a car...', () => {
        spyOn(typeCheckService, 'isCar').and.returnValue(true);

        expect(component.isItemACar()).toBe(true);
      });
    });

    describe('when the item is a real estate ...', () => {
      beforeEach(() => {
        component.itemDetail.item = MOCK_REALESTATE;
        component.itemSpecifications = null;

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should show the item specifications...', () => {
        expect(fixture.debugElement.query(By.directive(ItemSpecificationsComponent))).toBeTruthy();
      });
      it('should NOT be typed as a car...', () => {
        spyOn(typeCheckService, 'isCar').and.returnValue(false);

        expect(component.isItemACar()).toBe(false);
      });
    });

    describe('when the item is NOT a real estate or a car...', () => {
      beforeEach(() => {
        component.itemDetail.item = MOCK_ITEM_FASHION;
        component.itemSpecifications = null;

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should show the item specifications...', () => {
        expect(fixture.debugElement.query(By.directive(ItemSpecificationsComponent))).toBeFalsy();
      });

      it('should NOT be typed as a car...', () => {
        spyOn(typeCheckService, 'isCar').and.returnValue(false);

        expect(component.isItemACar()).toBe(false);
      });
    });
  });

  describe('when we have a car, fashion or cellphone as item', () => {
    describe('and we have extra info...', () => {
      beforeEach(() => {
        component.itemDetail.item = MOCK_ITEM_FASHION;

        component.ngOnInit();
        fixture.detectChanges();
      });
      it('should be shown the item extra info content', () => {
        const extraInfo = fixture.debugElement.query(By.css('tsl-item-extra-info'));

        expect(extraInfo).toBeTruthy();
      });

      describe('and the item is NOT a car...', () => {
        beforeEach(() => {
          component.itemDetail.item = MOCK_ITEM_CELLPHONES;

          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should NOT apply the car specificaitons style', () => {
          const carExtraInfoStyle = fixture.debugElement.query(By.css(carExtraInfoClass));

          expect(carExtraInfoStyle).toBeFalsy();
        });
      });

      describe('and the item is a car...', () => {
        beforeEach(() => {
          component.itemDetail.item = MOCK_CAR;

          component.ngOnInit();
          fixture.detectChanges();
        });
        it('should apply the car specifications style', () => {
          const carExtraInfoStyle = fixture.debugElement.query(By.css(carExtraInfoClass));

          expect(carExtraInfoStyle).toBeTruthy();
        });
      });
    });

    describe('and we NOT have extra info...', () => {
      beforeEach(() => {
        component.itemDetail.item = MOCK_CAR;
        spyOn(mapExtraInfoService, 'mapExtraInfo').and.returnValue(null);

        component.ngOnInit();
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
    describe('when the item have default taxonomy defined', () => {
      beforeEach(() => {
        spyOn(categoryService, 'getCategoryIconById').and.returnValue(of(MOCK_ICON));
        component.itemDetail.item = MOCK_ITEM_CELLPHONES;

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should show the item taxonomies...', () => {
        const itemTaxonomies = fixture.debugElement.query(By.directive(ItemTaxonomiesComponent));
        expect(itemTaxonomies).toBeTruthy();
      });

      it('should ask for the taxonomy category icon', () => {
        expect(categoryService.getCategoryIconById).toHaveBeenCalled();
        expect(component.taxonomiesSpecifications.icon).toBe(MOCK_ICON);
      });

      describe('and the parent object is NOT defined...', () => {
        it('the parent taxonomy will be the default object type', () => {
          expect(component.taxonomiesSpecifications.parentTaxonomy).toBe(ITEM_CELLPHONES_EXTRA_INFO.object_type.name);
        });

        it('the child taxonomy will be null', () => {
          expect(component.taxonomiesSpecifications.childTaxonomy).toBe(null);
        });
      });

      describe('and the parent object is defined...', () => {
        beforeEach(() => {
          component.itemDetail.item = MOCK_ITEM_CELLPHONES_PARENT_SUBCATEGORY;

          component.ngOnInit();
          fixture.detectChanges();
        });

        it('the parent taxonomy will be the parent object type', () => {
          expect(component.taxonomiesSpecifications.parentTaxonomy).toBe(
            ITEM_CELLPHONES_EXTRA_INFO_PARENT_OBJECT_TYPE.object_type.parent_object_type.name
          );
        });
        it('the child taxonomy will be the default object type', () => {
          expect(component.taxonomiesSpecifications.childTaxonomy).toBe(ITEM_CELLPHONES_EXTRA_INFO_PARENT_OBJECT_TYPE.object_type.name);
        });
      });
    });

    describe(`when the item don't have default taxonomy defined`, () => {
      beforeEach(() => {
        spyOn(categoryService, 'getCategoryIconById');
        component.itemDetail.item = MOCK_ITEM_CELLPHONES_NO_SUBCATEGORY;

        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should NOT show the item taxonomies...', () => {
        const itemTaxonomies = fixture.debugElement.query(By.directive(ItemTaxonomiesComponent));
        expect(itemTaxonomies).toBeFalsy();
      });

      it('the parent taxonomy will be null', () => {
        expect(component.taxonomiesSpecifications.parentTaxonomy).toBe(null);
      });

      it('the child taxonomy will be null', () => {
        expect(component.taxonomiesSpecifications.childTaxonomy).toBe(null);
      });

      it('should NOT ask for the taxonomy category icon', () => {
        expect(categoryService.getCategoryIconById).not.toHaveBeenCalled();
      });

      it('the icon taxonomy will be null', () => {
        expect(component.taxonomiesSpecifications.icon).toBe(null);
      });
    });
  });
});
