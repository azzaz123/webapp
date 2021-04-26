import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { ViewportService } from '@core/viewport/viewport.service';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { AdSlotGroupShoppingComponentSub } from '@fixtures/shared/components/ad-slot-group-shopping.component.stub';
import { AdComponentStub } from '@fixtures/shared/components/ad.component.stub';
import { ItemCardListComponentStub } from '@fixtures/shared/components/item-card-list.component.stub';
import { SearchErrorLayoutComponentStub } from '@fixtures/shared/components/search-error-layout.component.stub';
import { Store } from '@ngrx/store';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { PublicFooterService } from '@public/core/services/footer/public-footer.service';
import {
  FilterParameterStoreService,
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FILTER_PARAMETER_STORE_TOKEN,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { random } from 'faker';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { FiltersWrapperModule } from '../components/filters-wrapper/filters-wrapper.module';
import { SearchLayoutComponent } from '../components/search-layout/search-layout.component';
import { AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { SearchAdsService } from '../core/ads/search-ads.service';
import { SearchService } from '../core/services/search.service';
import { SearchComponent } from './search.component';
import { SLOTS_CONFIG_DESKTOP, SLOTS_CONFIG_MOBILE } from './search.config';

@Directive({
  selector: '[infinite-scroll]',
})
class InfiniteScrollStubDirective {
  @Input() public infiniteScrollDistance: number;
  @Input() public infiniteScrollThrottle: number;
  @Input() public infiniteScrollDisabled: number;
}

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let deviceServiceMock;
  let storeMock;
  let searchServiceMock;
  let publicFooterServiceMock;
  let searchAdsServiceMock;
  const itemsSubject: BehaviorSubject<ItemCard[]> = new BehaviorSubject<ItemCard[]>([]);
  const isLoadingResultsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  const hasMoreSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
      items$: itemsSubject.asObservable(),
      hasMore$: hasMoreSubject.asObservable(),
      isLoadingResults$: isLoadingResultsSubject.asObservable(),
      loadMore: () => {},
      close: () => {},
    };
    publicFooterServiceMock = {
      setShow: (show: boolean) => {},
    };
    searchAdsServiceMock = {
      setSlots: () => {},
    };
    await TestBed.configureTestingModule({
      declarations: [
        SearchComponent,
        SearchLayoutComponent,
        SearchErrorLayoutComponentStub,
        AdComponentStub,
        AdSlotGroupShoppingComponentSub,
        ItemCardListComponentStub,
        InfiniteScrollStubDirective,
      ],
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
          provide: SearchAdsService,
          useValue: searchAdsServiceMock,
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
        {
          provide: PublicFooterService,
          useValue: publicFooterServiceMock,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
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

      it('should initialize ads slots', () => {
        spyOn(searchAdsServiceMock, 'setSlots').and.callThrough();

        fixture.detectChanges();

        expect(searchAdsServiceMock.setSlots).toHaveBeenCalledWith();
        expect(searchAdsServiceMock.setSlots).toHaveBeenCalledTimes(1);
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

    describe('when no items are recieved', () => {
      it('should show the no results layout', (done) => {
        const items = [];
        itemsSubject.next(items);
        isLoadingResultsSubject.next(false);

        component.items$.subscribe(() => {
          fixture.detectChanges();
          const noResultsLayout = fixture.debugElement.query(By.css('tsl-search-error-layout'));

          expect(noResultsLayout).toBeTruthy();
          done();
        });
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

  describe('infinite scroll', () => {
    describe('with items and has more items', () => {
      beforeEach(() => {
        itemsSubject.next([MOCK_ITEM_CARD, MOCK_ITEM_CARD]);
        hasMoreSubject.next(true);
      });

      it('should appear the button to load more items', () => {
        fixture.detectChanges();

        const buttonLoadMore: HTMLElement = fixture.debugElement.query(By.css('#btn-load-more')).nativeElement;

        expect(buttonLoadMore.textContent).toBe('Ver más productos');
      });

      describe('with items but has not more items', () => {
        beforeEach(() => {
          itemsSubject.next([MOCK_ITEM_CARD, MOCK_ITEM_CARD]);
          hasMoreSubject.next(false);
        });

        it('should not appear the button to load more items', () => {
          fixture.detectChanges();

          const buttonLoadMore = fixture.debugElement.query(By.css('#btn-load-more'));

          expect(buttonLoadMore).toBeNull();
        });
      });
    });

    describe('when we click on load more products', () => {
      beforeEach(() => {
        itemsSubject.next([MOCK_ITEM_CARD, MOCK_ITEM_CARD]);
        hasMoreSubject.next(true);
      });
      it('should enable infinite scroll', (done) => {
        fixture.detectChanges();

        const buttonLoadMore: HTMLElement = fixture.debugElement.query(By.css('#btn-load-more')).nativeElement;
        buttonLoadMore.click();

        component.infiniteScrollDisabled$.subscribe((infiniteScrollDisabled) => {
          expect(infiniteScrollDisabled).toBe(false);
          done();
        });
      });

      it('should disapear the button to load more items', () => {
        fixture.detectChanges();

        const buttonLoadMore: HTMLElement = fixture.debugElement.query(By.css('#btn-load-more')).nativeElement;
        buttonLoadMore.click();

        fixture.detectChanges();
        const buttonLoadMoreExpected = fixture.debugElement.query(By.css('#btn-load-more'));

        expect(buttonLoadMoreExpected).toBeNull();
      });

      it('should disapear bottom ads on DESKTOP', () => {
        spyOn(deviceServiceMock, 'getDeviceType').and.returnValue(DeviceType.DESKTOP);
        fixture.detectChanges();

        const buttonLoadMore: HTMLElement = fixture.debugElement.query(By.css('#btn-load-more')).nativeElement;
        buttonLoadMore.click();

        fixture.detectChanges();
        const slotGroupShopping = fixture.debugElement.query(By.css('tsl-sky-slot-group-shopping'));

        expect(slotGroupShopping).toBeNull();
      });

      it('should hide footer and has items', () => {
        hasMoreSubject.next(true);
        spyOn(publicFooterServiceMock, 'setShow').and.callThrough();

        fixture.detectChanges();

        const buttonLoadMore: HTMLElement = fixture.debugElement.query(By.css('#btn-load-more')).nativeElement;
        buttonLoadMore.click();

        expect(publicFooterServiceMock.setShow).toHaveBeenCalledWith(false);
      });

      it('should set footer when has not items', () => {
        hasMoreSubject.next(false);
        spyOn(publicFooterServiceMock, 'setShow').and.callThrough();

        fixture.detectChanges();

        expect(publicFooterServiceMock.setShow).toHaveBeenCalledWith(true);
      });

      it('should ask more items to search service', () => {
        spyOn(searchServiceMock, 'loadMore').and.callThrough();
        fixture.detectChanges();

        const buttonLoadMore: HTMLElement = fixture.debugElement.query(By.css('#btn-load-more')).nativeElement;
        buttonLoadMore.click();

        expect(searchServiceMock.loadMore).toHaveBeenCalledTimes(1);
      });
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
