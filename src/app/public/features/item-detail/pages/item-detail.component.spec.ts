import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { SocialMetaTagService } from '@core/social-meta-tag/social-meta-tag.service';
import { MOCK_CAR } from '@fixtures/car.fixtures.spec';
import { DeviceDetectorServiceMock } from '@fixtures/remote-console.fixtures.spec';
import { MOCK_FULL_USER_FEATURED } from '@fixtures/user.fixtures.spec';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { PublicUserApiService } from '@public/core/services/api/public-user/public-user-api.service';
import { RecommenderApiService } from '@public/core/services/api/recommender/recommender-api.service';
import { MapItemService } from '@public/features/public-profile/pages/user-published/services/map-item/map-item.service';
import { CookieService } from 'ngx-cookie';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of } from 'rxjs';
import { ItemDetailService } from '../core/services/item-detail.service';

import { ItemDetailComponent } from './item-detail.component';

describe('ItemDetailComponent', () => {
  const topSkyTag = 'tsl-top-sky';
  const sideSkyTag = 'tsl-side-sky';
  const itemId = '123';
  const itemDetail = {
    item: MOCK_CAR,
    user: MOCK_FULL_USER_FEATURED,
  };

  let component: ItemDetailComponent;
  let fixture: ComponentFixture<ItemDetailComponent>;
  let deviceService: DeviceService;
  let itemDetailService: ItemDetailService;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemDetailComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        {
          provide: CookieService,
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
        ItemDetailService,
        ItemApiService,
        PublicUserApiService,
        RecommenderApiService,
        {
          provide: ItemDetailService,
          useValue: {
            getItem: () => {
              return of(itemDetail);
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

  describe('when er are on DESKTOP...', () => {
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
        expect(socialShareElement[socialShareKey]).toEqual(
          component.socialShare[socialShareKey]
        );
      });
    });
  });
});
