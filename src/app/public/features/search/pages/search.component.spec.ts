import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { ViewportService } from '@core/viewport/viewport.service';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { AdComponentStub } from '@fixtures/shared/components/ad.component.stub';
import { ItemCardListComponentStub } from '@fixtures/shared/components/item-card-list.component.stub';
import { random } from 'faker';
import { SearchFiltersModule } from '../components/search-filters/search-filters.module';
import { SearchLayoutComponent } from '../components/search-layout/search-layout.component';
import { AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { AdShoppingChannel } from '../core/ads/shopping/ad-shopping-channel';
import { AdShoppingPageOptionPublicSearchFactory, AD_SHOPPING_PUBLIC_SEARCH } from '../core/ads/shopping/search-ads-shopping.config';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let deviceServiceMock;

  beforeEach(
    waitForAsync(() => {
      deviceServiceMock = {
        getDeviceType: () => random.arrayElement([DeviceType.DESKTOP, DeviceType.MOBILE, DeviceType.TABLET]),
      };
      TestBed.configureTestingModule({
        declarations: [SearchComponent, SearchLayoutComponent, AdComponentStub, ItemCardListComponentStub],
        imports: [SearchFiltersModule],
        providers: [
          {
            provide: AdsService,
            useValue: MockAdsService,
          },
          {
            provide: DeviceService,
            useValue: deviceServiceMock,
          },
          ViewportService,
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the component init', () => {
    describe('when is desktop', () => {
      beforeEach(() => {
        spyOn(deviceServiceMock, 'getDeviceType').and.returnValue(DeviceType.DESKTOP);
      });

      it('should set ad keywords', () => {
        spyOn(MockAdsService, 'setAdKeywords').and.callThrough();

        component.ngOnInit();
        fixture.detectChanges();

        expect(MockAdsService.setAdKeywords).toHaveBeenCalledWith({ content: 'Iphone 11' });
      });

      it('should configure ads', () => {
        spyOn(MockAdsService, 'setSlots').and.callThrough();

        component.ngOnInit();
        fixture.detectChanges();

        expect(MockAdsService.setSlots).toHaveBeenCalledWith([
          AD_PUBLIC_SEARCH.search1,
          AD_PUBLIC_SEARCH.search2r,
          AD_PUBLIC_SEARCH.search3r,
        ]);
      });

      it('should display ad shopping', () => {
        spyOn(MockAdsService, 'displayAdShopping').and.callThrough();

        component.ngOnInit();
        fixture.detectChanges();

        expect(MockAdsService.displayAdShopping).toHaveBeenCalledWith(
          AdShoppingPageOptionPublicSearchFactory(AdShoppingChannel.SEARCH_PAGE),
          AD_SHOPPING_PUBLIC_SEARCH
        );
      });
    });
  });
  describe('when bubble filter is open', () => {
    beforeEach(() => {
      component.toggleBubbleFilterBackdrop(true);
    });
    it('should show white backdrop', () => {
      expect(component.showBackdrop).toBeTruthy();
    });
  });
  describe('when bubble filter is closed', () => {
    beforeEach(() => {
      component.toggleBubbleFilterBackdrop(false);
    });
    it('should hide white backdrop', () => {
      expect(component.showBackdrop).toBeFalsy();
    });
  });
});
