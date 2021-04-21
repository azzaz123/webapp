import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { ViewportService } from '@core/viewport/viewport.service';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { MOCK_SEARCH_ITEM } from '@fixtures/search-items.fixtures';
import { AdSlotGroupShoppingComponentSub } from '@fixtures/shared/components/ad-slot-group-shopping.component.stub';
import { AdComponentStub } from '@fixtures/shared/components/ad.component.stub';
import { ItemCardListComponentStub } from '@fixtures/shared/components/item-card-list.component.stub';
import { Store } from '@ngrx/store';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { random } from 'faker';
import { DeviceDetectorService } from 'ngx-device-detector';
import { of } from 'rxjs/internal/observable/of';
import { FiltersWrapperModule } from '../components/filters-wrapper/filters-wrapper.module';
import { SearchLayoutComponent } from '../components/search-layout/search-layout.component';
import { AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { SearchStoreService } from '../core/services/search-store.service';
import { SearchComponent } from './search.component';
import { SLOTS_CONFIG_DESKTOP, SLOTS_CONFIG_MOBILE } from './search.config';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let searchStoreService: SearchStoreService;
  let deviceServiceMock;
  let storeMock;

  beforeEach(async () => {
    deviceServiceMock = {
      getDeviceType: () => random.arrayElement([DeviceType.DESKTOP, DeviceType.MOBILE, DeviceType.TABLET]),
      isMobile: () => false,
    };
    storeMock = {
      select: () => of(),
      dispatch: () => {},
    };
    await TestBed.configureTestingModule({
      declarations: [SearchComponent, SearchLayoutComponent, AdComponentStub, AdSlotGroupShoppingComponentSub, ItemCardListComponentStub],
      imports: [FiltersWrapperModule, HttpClientTestingModule],
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    searchStoreService = TestBed.inject(SearchStoreService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the component init', () => {
    describe('on init', () => {
      it('should initialise items observable', () => {
        fixture.detectChanges();
        expect(component.items$).toBeTruthy();
      });

      it('should initialise items observable', () => {
        fixture.detectChanges();
        expect(component.items$).toBeTruthy();
      });
    });

    describe('when is desktop', () => {
      beforeEach(() => {
        spyOn(deviceServiceMock, 'getDeviceType').and.returnValue(DeviceType.DESKTOP);
      });

      it('should set ad keywords', () => {
        spyOn(MockAdsService, 'setAdKeywords').and.callThrough();

        fixture.detectChanges();

        expect(MockAdsService.setAdKeywords).toHaveBeenCalledWith({ content: 'Iphone 11' });
      });

      it('should configure ads', () => {
        spyOn(MockAdsService, 'setSlots').and.callThrough();

        fixture.detectChanges();

        expect(MockAdsService.setSlots).toHaveBeenCalledWith([
          AD_PUBLIC_SEARCH.search1,
          AD_PUBLIC_SEARCH.search2r,
          AD_PUBLIC_SEARCH.search3r,
        ]);
      });
    });
  });

  describe('when items change', () => {
    const oldItems = [{ ...MOCK_SEARCH_ITEM, id: 'old_item' }];
    beforeEach(() => {
      fixture.detectChanges();
      searchStoreService.setItems(oldItems);
    });
    it('should update items', () => {
      const newItems = [MOCK_SEARCH_ITEM, MOCK_SEARCH_ITEM];
      let nextItems: ItemCard[] = [];
      component.items$.subscribe((items) => (nextItems = items));

      searchStoreService.appendItems(newItems);

      expect(nextItems.length).toBe(3);
      nextItems.forEach((nextItem, index) => {
        expect(nextItem.id).toBe(index !== 0 ? MOCK_SEARCH_ITEM.id : 'old_item');
      });
    });
  });
  describe('when bubble filter is open', () => {
    it('should show white backdrop', () => {
      let bubbleOpenCount = 0;

      component.openBubbleCount$.subscribe((count) => (bubbleOpenCount = count));
      component.toggleBubbleFilterBackdrop(true);

      expect(bubbleOpenCount).toBe(1);
    });
  });
  describe('when bubble filter is closed', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.toggleBubbleFilterBackdrop(true);
    });
    it('should hide white backdrop', () => {
      let bubbleOpenCount = 1;

      component.openBubbleCount$.subscribe((count) => (bubbleOpenCount = count));
      component.toggleBubbleFilterBackdrop(false);

      expect(bubbleOpenCount).toBe(0);
    });
  });

  describe('when we want to show ads natives', () => {
    describe('on desktop or tablet', () => {
      beforeEach(() => {
        spyOn(deviceServiceMock, 'isMobile').and.returnValue(false);
      });

      it('should set slots config of desktop config', () => {
        fixture.detectChanges();

        expect(component.slotsConfig).toEqual(SLOTS_CONFIG_DESKTOP);
      });
    });

    describe('on mobile', () => {
      beforeEach(() => {
        spyOn(deviceServiceMock, 'isMobile').and.returnValue(true);
      });

      it('should set slots config of mobile config', () => {
        fixture.detectChanges();

        expect(component.slotsConfig).toEqual(SLOTS_CONFIG_MOBILE);
      });
    });
  });
});
