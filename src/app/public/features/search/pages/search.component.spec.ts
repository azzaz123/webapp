import { ButtonComponent } from 'app/shared/button/button.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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
    };
    storeMock = {
      select: () => of(),
      dispatch: () => {},
    };
    searchServiceMock = {
      init: () => {},
      items$: itemsSubject.asObservable(),
      loadMore: () => {},
      close: () => {},
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

  describe('infinite scroll', () => {
    describe('at the init', () => {
      it('should appear the button to load more items', () => {
        fixture.detectChanges();

        const buttonLoadMore: HTMLElement = fixture.debugElement.query(By.css('#btn-load-more')).nativeElement;

        expect(buttonLoadMore.textContent).toBe('Ver más productos');
      });
    });

    describe('when we click on load more products', () => {
      it('should enable infinite scroll', () => {
        fixture.detectChanges();

        const buttonLoadMore: HTMLElement = fixture.debugElement.query(By.css('#btn-load-more')).nativeElement;
        buttonLoadMore.click();

        expect(component.infiniteScrollDisabled).toBe(false);
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

      it('should ask more items to search service', () => {
        spyOn(searchServiceMock, 'loadMore').and.callThrough();
        fixture.detectChanges();

        const buttonLoadMore: HTMLElement = fixture.debugElement.query(By.css('#btn-load-more')).nativeElement;
        buttonLoadMore.click();

        expect(searchServiceMock.loadMore).toHaveBeenCalledTimes(1);
      });
    });
  });
});
