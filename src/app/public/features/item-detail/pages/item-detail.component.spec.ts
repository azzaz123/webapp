import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { CustomCurrencyPipe } from '@shared/pipes';
import {
  MOCK_ITEM,
  MOCK_ITEM_WITHOUT_LOCATION,
  MOCK_ITEM_GBP,
  MOCK_ITEM_FASHION,
  MOCK_ITEM_CELLPHONES,
  MOCK_ITEM_CAR,
} from '@fixtures/item.fixtures.spec';
import { MOCK_USER } from '@fixtures/user.fixtures.spec';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';
import { MOCK_CAR } from '@fixtures/car.fixtures.spec';
import { DeviceDetectorServiceMock } from '@fixtures/remote-console.fixtures.spec';
import { MOCK_FULL_USER_FEATURED } from '@fixtures/user.fixtures.spec';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { MapItemService } from '@public/features/public-profile/pages/user-published/services/map-item/map-item.service';
import { of } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ItemDetailService } from '../core/services/item-detail.service';
import { ItemDetailComponent } from './item-detail.component';
import {
  RECOMMENDED_ITEMS_MOCK,
  EMPTY_RECOMMENDED_ITEMS_MOCK,
} from '@public/features/item-detail/components/recommended-items/constants/recommended-items.fixtures.spec';

describe('ItemDetailComponent', () => {
  const topSkyTag = 'tsl-top-sky';
  const sideSkyTag = 'tsl-side-sky';
  const mapTag = 'tsl-here-maps';
  const recommendedItemsTag = 'tsl-recommended-items';
  const currencies = {
    EUR: '€',
    GBP: '£',
  };
  const itemPriceClass = '.ItemDetail__price';
  const fallbackMapClass = '.ItemDetail__fakeMap';
  const locationClass = '.ItemDetail__location';
  const itemId = '123';
  const itemDetail = {
    item: MOCK_CAR,
    user: MOCK_FULL_USER_FEATURED,
  };

  let component: ItemDetailComponent;
  let fixture: ComponentFixture<ItemDetailComponent>;
  let deviceService: DeviceService;
  let itemDetailService: ItemDetailService;
  let decimalPipe: DecimalPipe;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemDetailComponent, CustomCurrencyPipe],
      imports: [HttpClientTestingModule],
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
        ItemApiService,
        PublicUserApiService,
        RecommenderApiService,
        {
          provide: ItemDetailService,
          useValue: {
            getItem: () => {
              return of(itemDetail);
            },
            getRecommendedItems: () => {
              return of(RECOMMENDED_ITEMS_MOCK);
            },
          },
        },
        MapItemService,
        SocialMetaTagService,
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when we are on MOBILE...', () => {
    it('should NOT show ADS', () => {
      spyOn(deviceService, 'getDeviceType').and.returnValue(DeviceType.MOBILE);

      component.ngOnInit();
      fixture.detectChanges();
      const topAd = fixture.debugElement.query(By.css(topSkyTag));
      const sideAds = fixture.debugElement.queryAll(By.css(sideSkyTag));

      expect(topAd).toBeFalsy();
      expect(sideAds.length).toBe(0);
    });
  });

  describe('when we are on TABLET...', () => {
    it('should show only the top AD', () => {
      spyOn(deviceService, 'getDeviceType').and.returnValue(DeviceType.TABLET);

      component.ngOnInit();
      fixture.detectChanges();
      const topAd = fixture.debugElement.query(By.css(topSkyTag));
      const sideAds = fixture.debugElement.queryAll(By.css(sideSkyTag));

      expect(topAd).toBeTruthy();
      expect(sideAds.length).toBe(0);
    });
  });

  describe('when we are on DESKTOP...', () => {
    it('should show the three ADS', () => {
      spyOn(deviceService, 'getDeviceType').and.returnValue(DeviceType.DESKTOP);

      component.ngOnInit();
      fixture.detectChanges();
      const topAd = fixture.debugElement.query(By.css(topSkyTag));
      const sideAds = fixture.debugElement.queryAll(By.css(sideSkyTag));

      expect(topAd).toBeTruthy();
      expect(sideAds.length).toBe(2);
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
    it('should ask for item data', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.itemDetail).toBe(itemDetail);
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
  });

  describe('when we have an item...', () => {
    beforeEach(() => {
      component.itemDetail = itemDetail;
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
  });
});
