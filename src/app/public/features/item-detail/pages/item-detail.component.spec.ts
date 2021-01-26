import { DecimalPipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { MOCK_ITEM_GBP } from '@fixtures/item.fixtures.spec';
import { MOCK_ITEM_1 } from '@public/shared/components/item-card/item-card.mock.stories';
import { DeviceDetectorServiceMock } from '@fixtures/remote-console.fixtures.spec';
import { CustomCurrencyPipe } from '@shared/pipes';
import { CookieService } from 'ngx-cookie';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ItemDetailComponent } from './item-detail.component';

describe('ItemDetailComponent', () => {
  const topSkyTag = 'tsl-top-sky';
  const sideSkyTag = 'tsl-side-sky';
  const itemPriceClass = '.ItemDetail__price';
  const currencies = {
    EUR: '€',
    GBP: '£',
  };

  let component: ItemDetailComponent;
  let fixture: ComponentFixture<ItemDetailComponent>;
  let deviceService: DeviceService;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemDetailComponent, CustomCurrencyPipe],
      providers: [
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceMock },
        {
          provide: CookieService,
          useValue: {},
        },
        DecimalPipe,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM_1;
    deviceService = TestBed.inject(DeviceService);
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

  describe('when we have an item...', () => {
    it('should print their title', () => {
      expect(el.querySelector('.ItemDetail__title').innerHTML).toEqual(
        component.item.title
      );
    });

    it('should print their description', () => {
      expect(el.querySelector('.ItemDetail__description').innerHTML).toEqual(
        component.item.description
      );
    });

    describe('when the favorites and views are NOT defined...', () => {
      it('should show the 0 stat', () => {
        expect(el.querySelector('#favorites').innerHTML).toEqual('0');
        expect(el.querySelector('#views').innerHTML).toEqual('0');
      });
    });

    describe('when the favorites and views are defined...', () => {
      beforeEach(() => {
        component.item.favorites = 3;
        component.item.views = 5;
        fixture.detectChanges();
      });

      it('should print their favorites stat', () => {
        expect(el.querySelector('#favorites').innerHTML).toEqual(
          component.item.favorites.toString()
        );
      });
      it('should print their views stat', () => {
        expect(el.querySelector('#views').innerHTML).toEqual(
          component.item.views.toString()
        );
      });
    });

    describe('when the item currency code is in euros...', () => {
      it('should show the price and the euros symbol', () => {
        expect(el.querySelector(itemPriceClass).innerHTML).toEqual(
          `${component.item.salePrice}${currencies.EUR}`
        );
      });
    });

    describe('when the item currency code is in dollars...', () => {
      beforeEach(() => {
        component.item = MOCK_ITEM_GBP;
        fixture.detectChanges();
      });
      it('should show the price and the dollar symbol', () => {
        expect(el.querySelector(itemPriceClass).innerHTML).toEqual(
          `${currencies.GBP}${component.item.salePrice}`
        );
      });
    });
  });
});
