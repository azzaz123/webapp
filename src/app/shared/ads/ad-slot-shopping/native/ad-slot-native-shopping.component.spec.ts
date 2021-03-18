import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AD_SHOPPING_STYLE_ID_DESKTOP, AD_SHOPPING_STYLE_ID_MOBILE, AD_SHOPPING_STYLE_ID_WIDE } from '@core/ads/constants';
import { AdsService } from '@core/ads/services';
import { DeviceService } from '@core/device/device.service';
import { MockAdShoppingPageOptions, MockAdsService } from '@fixtures/ads.fixtures.spec';
import { AdSlotNativeShoppingComponent } from './ad-slot-native-shopping.component';

describe('AdSlotNativeShoppingComponent', () => {
  let component: AdSlotNativeShoppingComponent;
  let fixture: ComponentFixture<AdSlotNativeShoppingComponent>;
  let elementRef: any;

  const deviceServiceMock = {
    isMobile: () => false,
  };

  const adSlotContainerMock = 'div-gpt-ad-1536058445169';
  const indexMock = 10;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AdSlotNativeShoppingComponent],
        providers: [
          { provide: AdsService, useValue: MockAdsService },
          {
            provide: DeviceService,
            useValue: deviceServiceMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AdSlotNativeShoppingComponent);
    component = fixture.componentInstance;
    component.adSlotContainer = adSlotContainerMock;
    component.index = indexMock;
    component.adShoppingPageOptions = MockAdShoppingPageOptions;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set div element id', () => {
    fixture.detectChanges();

    elementRef = fixture.debugElement.query(By.css(`#${adSlotContainerMock}-${indexMock.toString()}`)).nativeElement;
  });

  describe('when the view init', () => {
    it('should display ad wide shopping', () => {
      component.isWide = true;
      spyOn(MockAdsService, 'displayAdShopping').and.callThrough();

      fixture.detectChanges();
      component.ngAfterViewInit();

      expect(MockAdsService.displayAdShopping).toHaveBeenCalledWith(MockAdShoppingPageOptions, {
        container: `${adSlotContainerMock}-${indexMock.toString()}`,
        styleId: AD_SHOPPING_STYLE_ID_WIDE,
        linkTarget: '_blank',
      });
    });

    describe('on desktop', () => {
      beforeEach(() => {
        spyOn(deviceServiceMock, 'isMobile').and.returnValue(false);
        fixture.detectChanges();
      });
      it('should display ad shopping', () => {
        spyOn(MockAdsService, 'displayAdShopping').and.callThrough();

        component.ngAfterViewInit();

        expect(MockAdsService.displayAdShopping).toHaveBeenCalledWith(MockAdShoppingPageOptions, {
          container: `${adSlotContainerMock}-${indexMock.toString()}`,
          styleId: AD_SHOPPING_STYLE_ID_DESKTOP,
          linkTarget: '_blank',
        });
      });
    });

    describe('on mobile', () => {
      beforeEach(() => {
        spyOn(deviceServiceMock, 'isMobile').and.returnValue(true);
        fixture.detectChanges();
      });
      it('should display ad shopping', () => {
        spyOn(MockAdsService, 'displayAdShopping').and.callThrough();

        component.ngAfterViewInit();

        expect(MockAdsService.displayAdShopping).toHaveBeenCalledWith(MockAdShoppingPageOptions, {
          container: `${adSlotContainerMock}-${indexMock.toString()}`,
          styleId: AD_SHOPPING_STYLE_ID_MOBILE,
          linkTarget: '_blank',
        });
      });
    });
  });
});
