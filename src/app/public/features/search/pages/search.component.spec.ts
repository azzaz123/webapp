import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { ViewportService } from '@core/viewport/viewport.service';
import { MockAdsService } from '@fixtures/ads.fixtures.spec';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { AdSlotGroupShoppingComponentSub } from '@fixtures/shared/components/ad-slot-group-shopping.component.stub';
import { AdComponentStub } from '@fixtures/shared/components/ad.component.stub';
import { ItemCardListComponentStub } from '@fixtures/shared/components/item-card-list.component.stub';
import { Store } from '@ngrx/store';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { random } from 'faker';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { FiltersWrapperModule } from '../components/filters-wrapper/filters-wrapper.module';
import { SearchLayoutComponent } from '../components/search-layout/search-layout.component';
import { AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { SearchService } from '../core/services/search.service';
import { SearchComponent } from './search.component';
import {
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FILTER_PARAMETER_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { SLOTS_CONFIG_DESKTOP, SLOTS_CONFIG_MOBILE } from './search.config';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let deviceServiceMock;
  let storeMock;
  let searchServiceMock;
  const itemsSubject: BehaviorSubject<ItemCard[]> = new BehaviorSubject<ItemCard[]>([]);

  beforeEach(async () => {
    deviceServiceMock = {
      getDeviceType: () => random.arrayElement([DeviceType.DESKTOP, DeviceType.MOBILE, DeviceType.TABLET]),
      isMobile: () => false,
    };
    storeMock = {
      select: () => of(),
      dispatch: () => {},
    };
    searchServiceMock = {
      init: () => {},
      items$: itemsSubject.asObservable(),
      loadMore: () => {},
    };
    await TestBed.configureTestingModule({
      declarations: [SearchComponent, SearchLayoutComponent, AdComponentStub, AdSlotGroupShoppingComponentSub, ItemCardListComponentStub],
      imports: [FiltersWrapperModule, HttpClientTestingModule],
      providers: [
        {
          provide: SearchService,
          useValue: searchServiceMock,
        },
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
        {
          provide: FILTER_PARAMETER_STORE_TOKEN,
          useClass: FilterParameterStoreService,
        },
        {
          provide: FILTER_PARAMETER_DRAFT_STORE_TOKEN,
          useClass: FilterParameterStoreService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
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
    const oldItems = [{ ...MOCK_ITEM_CARD, id: 'old_item' }];

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should update items', (done) => {
      const newItems = [MOCK_ITEM_CARD, MOCK_ITEM_CARD];
      itemsSubject.next([...oldItems, ...newItems]);

      component.items$.subscribe((items) => {
        expect(items.length).toBe(3);
        items.forEach((nextItem, index) => {
          expect(nextItem.id).toBe(index !== 0 ? MOCK_ITEM_CARD.id : 'old_item');
        });
        done();
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
