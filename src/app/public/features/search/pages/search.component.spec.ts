import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { Item } from '@core/item/item';
import { ViewportService } from '@core/viewport/viewport.service';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { MOCK_SEARCH_ITEM } from '@fixtures/search-items.fixtures';
import { AdComponentStub } from '@fixtures/shared/components/ad.component.stub';
import { ItemCardListComponentStub } from '@fixtures/shared/components/item-card-list.component.stub';
import { Store } from '@ngrx/store';
import { random } from 'faker';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of } from 'rxjs/internal/observable/of';
import { SearchFiltersModule } from '../components/search-filters/search-filters.module';
import { SearchLayoutComponent } from '../components/search-layout/search-layout.component';
import { AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { AdShoppingChannel } from '../core/ads/shopping/ad-shopping-channel';
import { AdShoppingPageOptionPublicSearchFactory, AD_SHOPPING_PUBLIC_SEARCH } from '../core/ads/shopping/search-ads-shopping.config';
import { SearchStoreService } from '../core/services/search-store.service';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchStoreService: SearchStoreService;
  let deviceServiceMock;
  let storeMock;

  beforeEach(
    waitForAsync(() => {
      deviceServiceMock = {
        getDeviceType: () => random.arrayElement([DeviceType.DESKTOP, DeviceType.MOBILE, DeviceType.TABLET]),
      };
      storeMock = {
        select: () => of(),
        dispatch: () => {},
      };
      TestBed.configureTestingModule({
        declarations: [SearchComponent, SearchLayoutComponent, AdComponentStub, ItemCardListComponentStub],
        imports: [SearchFiltersModule],
        providers: [
          SearchStoreService,
          {
            provide: Store,
            useValue: storeMock,
          },
          { provide: DeviceDetectorService, useValue: { isMobile: () => false } },
          { provide: ViewportService, useValue: { onViewportChange: of('') } },
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
    searchStoreService = TestBed.inject(SearchStoreService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the component init', () => {
    describe('on init', () => {
      it('should initialise items observable', () => {
        component.ngOnInit();

        expect(component.items$).toBeTruthy();
      });

      it('should initialise items observable', () => {
        component.ngOnInit();

        expect(component.items$).toBeTruthy();
      });
    });

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

  describe('when items change', () => {
    const oldItems = [{ ...MOCK_SEARCH_ITEM, id: 'old_item' }];
    beforeEach(() => {
      component.ngOnInit();
      searchStoreService.setItems(oldItems);
    });
    it('should update items', () => {
      const newItems = [MOCK_SEARCH_ITEM, MOCK_SEARCH_ITEM];
      let nextItems: Item[] = [];
      component.items$.subscribe((items) => (nextItems = items));

      searchStoreService.appendItems(newItems);

      expect(nextItems.length).toBe(3);
      nextItems.forEach((nextItem, index) => {
        expect(nextItem).toBeInstanceOf(Item);
        expect(nextItem.id).toBe(index !== 0 ? MOCK_SEARCH_ITEM.id : 'old_item');
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
