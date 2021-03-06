import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Directive, Input } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { ViewportService } from '@core/viewport/viewport.service';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { AdSlotGroupShoppingComponentStub } from '@fixtures/shared/components/ad-slot-group-shopping.component.stub';
import { AdComponentStub } from '@fixtures/shared/components/ad.component.stub';
import { ItemCardListComponentStub } from '@fixtures/shared/components/item-card-list.component.stub';
import { SearchErrorLayoutStubComponent } from '@fixtures/shared/components/search-error-layout-stub.component';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { PublicFooterService } from '@public/core/services/footer/public-footer.service';
import { CARD_TYPES } from '@public/shared/components/item-card-list/enums/card-types.enum';
import {
  FilterParameterStoreService,
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FILTER_PARAMETER_STORE_TOKEN,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { ButtonModule } from '@shared/button/button.module';
import { random } from 'faker';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { SortFilterModule } from '../components/sort-filter/sort-filter.module';
import { SearchAdsService } from '../core/ads/search-ads.service';
import { SearchService } from '../core/services/search.service';
import { REGULAR_CARDS_COLUMNS_CONFIG, SearchComponent, WIDE_CARDS_COLUMNS_CONFIG } from './search.component';
import { SLOTS_CONFIG_DESKTOP, SLOTS_CONFIG_MOBILE } from './search.config';
import { SearchQueryStringService } from '@core/search/search-query-string.service';
import { QueryStringLocationService } from '@core/search/query-string-location.service';
import { CookieService } from 'ngx-cookie';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { MockToastService } from '@fixtures/toast-service.fixtures.spec';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { SearchTrackingEventsService } from '@public/core/services/search-tracking-events/search-tracking-events.service';
import { MockSearchTrackingEventsService } from '@public/core/services/search-tracking-events/search-tracking-events.service.fixture';
import { MOCK_ITEM_INDEX } from '@public/features/item-detail/core/services/item-detail-track-events/track-events.fixtures.spec';
import { HostVisibilityService } from '@public/shared/components/filters/components/filter-group/components/filter-host/services/host-visibility.service';
import {
  MockSearchListTrackingEventService,
  MOCK_SEARCH_ID,
} from '../core/services/search-list-tracking-events/search-list-tracking-events.fixtures.spec';
import { SearchListTrackingEventsService } from '../core/services/search-list-tracking-events/search-list-tracking-events.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { AdSlotShoppingComponentStub } from '@fixtures/shared/components/ad-shopping.component.stub';
import { SearchResponseExtraData } from '../core/services/interfaces/search-response-extra-data.interface';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { NgxPermissionsAllowStubDirective, NgxPermissionsRestrictStubDirective } from 'ngx-permissions';
import { SortByService } from '../components/sort-filter/services/sort-by.service';
import { SORT_BY } from '@api/core/model/lists/sort.enum';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { ExperimentationService } from '@core/experimentation/services/experimentation/experimentation.service';
import { ExperimentationServiceMock } from '@fixtures/experimentation.fixtures.spec';
import { SearchLayoutStubComponent } from '@fixtures/shared/components/search-layout.component.stub';
import { FiltersWrapperStubModule } from '../components/filters-wrapper/filters-wrapper.module.stub';

@Directive({
  selector: '[tslInfiniteScroll]',
})
class InfiniteScrollStubDirective {
  @Input() public infiniteScrollDistance: number;
  @Input() public infiniteScrollDisabled: number;
}

describe('SearchComponent', () => {
  const itemCardListTag = 'tsl-public-item-card-list';
  const infoBubbleSelector = '.Search__filters__bubble';
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let deviceServiceMock;
  let storeMock;
  let searchServiceMock;
  let publicFooterServiceMock;
  let searchAdsServiceMock;
  let filterParameterStoreServiceMock;
  let searchListTrackingEventsService: SearchListTrackingEventsService;
  let searchTrackingEventsService: SearchTrackingEventsService;
  let filterParameterStoreService: FilterParameterStoreService;
  const itemsSubject: BehaviorSubject<ItemCard[]> = new BehaviorSubject<ItemCard[]>([]);
  const isLoadingResultsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  const isLoadingPaginationResultsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  const currentCategoryIdSubject: BehaviorSubject<string> = new BehaviorSubject<string>(undefined);
  const searchResponseExtraDataSubject: BehaviorSubject<SearchResponseExtraData> = new BehaviorSubject<SearchResponseExtraData>(null);
  const hasMoreSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  const parametersSubject: ReplaySubject<FilterParameter[]> = new ReplaySubject<FilterParameter[]>();

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
      isLoadingPaginationResults$: isLoadingPaginationResultsSubject.asObservable(),
      currentCategoryId$: currentCategoryIdSubject.asObservable(),
      newSearch$: searchResponseExtraDataSubject.asObservable(),

      init: () => {},
      loadMore: () => {},
      close: () => {},
    };
    filterParameterStoreServiceMock = {
      parameters$: parametersSubject.asObservable(),
      getParameters: () => [],
      getParametersByKeys: () => [],
      setParameters: () => {},
    };
    publicFooterServiceMock = {
      setShow: (show: boolean) => {},
    };
    searchAdsServiceMock = {
      init: () => {},
      setSlots: () => {},
      close: () => {},
      clearSlots: () => {},
      refreshSlots: () => {},
    };
    await TestBed.configureTestingModule({
      declarations: [
        SearchComponent,
        SearchLayoutStubComponent,
        SearchErrorLayoutStubComponent,
        AdComponentStub,
        AdSlotGroupShoppingComponentStub,
        AdSlotShoppingComponentStub,
        ItemCardListComponentStub,
        InfiniteScrollStubDirective,
        NgxPermissionsAllowStubDirective,
      ],
      imports: [
        FiltersWrapperStubModule,
        HttpClientTestingModule,
        SortFilterModule,
        ButtonModule,
        RouterTestingModule.withRoutes([
          {
            path: 'search',
            redirectTo: '',
          },
        ]),
      ],
      providers: [
        {
          provide: SearchService,
          useValue: searchServiceMock,
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
          useValue: filterParameterStoreServiceMock,
        },
        {
          provide: FILTER_PARAMETER_DRAFT_STORE_TOKEN,
          useValue: filterParameterStoreServiceMock,
        },
        {
          provide: PublicFooterService,
          useValue: publicFooterServiceMock,
        },
        SearchQueryStringService,
        QueryStringLocationService,
        { provide: CookieService, useValue: MockCookieService },
        {
          provide: SearchListTrackingEventsService,
          useClass: MockSearchListTrackingEventService,
        },
        { provide: ToastService, useClass: MockToastService },
        HostVisibilityService,
        {
          provide: SearchTrackingEventsService,
          useClass: MockSearchTrackingEventsService,
        },
        {
          provide: ExperimentationService,
          useValue: ExperimentationServiceMock,
        },
        {
          provide: SITE_URL,
          useValue: MOCK_SITE_URL,
        },
        SortByService,
        {
          provide: FeatureFlagService,
          useValue: {
            getFlag() {
              return of();
            },
          },
        },
      ],
    }).compileComponents();
  });

  describe('when the user has permissions to view ads', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SearchComponent);
      searchListTrackingEventsService = TestBed.inject(SearchListTrackingEventsService);
      searchTrackingEventsService = TestBed.inject(SearchTrackingEventsService);
      filterParameterStoreService = TestBed.inject(FilterParameterStoreService);

      component = fixture.componentInstance;
    });

    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    describe('when the component init', () => {
      describe('on init', () => {
        it('should initialise items observable', () => {
          fixture.detectChanges();
          expect(component.items$).toBeTruthy();
        });

        it('should initialise sortBy observable', () => {
          fixture.detectChanges();
          expect(component.sortBy$).toBeTruthy();
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

      it('should show the loading state', (done) => {
        const newItems = [MOCK_ITEM_CARD];
        itemsSubject.next(newItems);
        isLoadingResultsSubject.next(true);

        component.items$.subscribe(() => {
          fixture.detectChanges();
          const itemCardList = fixture.debugElement.query(By.css(itemCardListTag)).componentInstance;

          expect(itemCardList.isLoading).toBe(true);
          done();
        });
      });

      describe('when no items are recieved', () => {
        describe('and not loading new results', () => {
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

        describe('and loading new results', () => {
          it('should show the loading placeholder', (done) => {
            const items = [];
            itemsSubject.next(items);
            isLoadingResultsSubject.next(true);

            component.items$.subscribe(() => {
              fixture.detectChanges();
              const itemCardList = fixture.debugElement.query(By.css(itemCardListTag)).componentInstance;

              expect(itemCardList.showPlaceholder).toBe(true);
              done();
            });
          });
        });
      });
    });

    describe('when a filter is opened', () => {
      it('should show the filter content above the top bar', () => {
        const filtersWrapper = fixture.debugElement.query(By.css('tsl-filters-wrapper'));
        const searchFilters = fixture.debugElement.query(By.css('.Search__filters'));
        const expectedClass = 'Search__filters--opened';

        filtersWrapper.triggerEventHandler('filterOpened', true);
        fixture.detectChanges();

        expect(component.filterOpened).toBe(true);
        expect(searchFilters.nativeElement.classList).toContain(expectedClass);
      });
    });

    describe('when search category changes', () => {
      function getItemCardListInstance() {
        return fixture.debugElement.query(By.css(itemCardListTag)).componentInstance;
      }

      beforeEach(() => {
        itemsSubject.next([MOCK_ITEM_CARD]);
      });

      describe('and new search category is cars', () => {
        it('should show wide cards', (done) => {
          currentCategoryIdSubject.next(`${CATEGORY_IDS.CAR}`);

          component.listCardType$.subscribe(() => {
            fixture.detectChanges();

            expect(getItemCardListInstance().cardType).toEqual(CARD_TYPES.WIDE);
            done();
          });
        });

        it('should change the list columns configuration for using wide cards', (done) => {
          currentCategoryIdSubject.next(`${CATEGORY_IDS.CAR}`);

          component.listColumnsConfig$.subscribe(() => {
            fixture.detectChanges();

            expect(getItemCardListInstance().columnsConfig).toEqual(WIDE_CARDS_COLUMNS_CONFIG);
            done();
          });
        });
      });

      describe('and new search category is real estate', () => {
        it('should show wide cards', (done) => {
          currentCategoryIdSubject.next(`${CATEGORY_IDS.REAL_ESTATE}`);

          component.listCardType$.subscribe(() => {
            fixture.detectChanges();

            expect(getItemCardListInstance().cardType).toEqual(CARD_TYPES.WIDE);
            done();
          });
        });

        it('should change the list columns configuration for using wide cards', (done) => {
          currentCategoryIdSubject.next(`${CATEGORY_IDS.REAL_ESTATE}`);

          component.listColumnsConfig$.subscribe(() => {
            fixture.detectChanges();

            expect(getItemCardListInstance().columnsConfig).toEqual(WIDE_CARDS_COLUMNS_CONFIG);
            done();
          });
        });
      });

      describe('and new search category is from consumer goods', () => {
        it('should show regular cards', (done) => {
          currentCategoryIdSubject.next(`${CATEGORY_IDS.CELL_PHONES_ACCESSORIES}`);

          component.listCardType$.subscribe(() => {
            fixture.detectChanges();

            expect(getItemCardListInstance().cardType).toEqual(CARD_TYPES.REGULAR);
            done();
          });
        });

        it('should change the list columns configuration for using regular cards', (done) => {
          currentCategoryIdSubject.next(`${CATEGORY_IDS.CELL_PHONES_ACCESSORIES}`);

          component.listColumnsConfig$.subscribe(() => {
            fixture.detectChanges();

            expect(getItemCardListInstance().columnsConfig).toEqual(REGULAR_CARDS_COLUMNS_CONFIG);
            done();
          });
        });
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

          expect(buttonLoadMore).toBeTruthy();
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

        describe('when categoryId changes', () => {
          it('should disable infinite scroll', (done) => {
            fixture.detectChanges();

            const buttonLoadMore: HTMLElement = fixture.debugElement.query(By.css('#btn-load-more')).nativeElement;
            buttonLoadMore.click();

            component.infiniteScrollDisabled$.subscribe((infiniteScrollDisabled) => {
              expect(infiniteScrollDisabled).toBe(false);
              done();
            });

            currentCategoryIdSubject.next(CATEGORY_IDS.MOTORBIKE.toString());
          });
        });

        describe('when loading pagination results', () => {
          it('should show the pagination loading spinner', (done) => {
            const newItems = [MOCK_ITEM_CARD];
            itemsSubject.next(newItems);
            isLoadingPaginationResultsSubject.next(true);

            component.isLoadingPaginationResults$.subscribe(() => {
              fixture.detectChanges();
              const loadingSpinner = fixture.debugElement.query(By.css('.Search__spinner'));

              expect(loadingSpinner).toBeTruthy();
              done();
            });
          });
        });
      });
    });

    describe('when click on item card', () => {
      it('should send track click item card event', () => {
        spyOn(searchListTrackingEventsService, 'trackClickItemCardEvent');
        searchResponseExtraDataSubject.next({ searchId: MOCK_SEARCH_ID, sortBy: SORT_BY.DISTANCE });
        itemsSubject.next([MOCK_ITEM_CARD, MOCK_ITEM_CARD]);
        fixture.detectChanges();
        const publicItemCard = fixture.debugElement.query(By.css(itemCardListTag));

        publicItemCard.triggerEventHandler('clickedItemAndIndex', { itemCard: MOCK_ITEM_CARD, index: MOCK_ITEM_INDEX });

        expect(searchListTrackingEventsService.trackClickItemCardEvent).toHaveBeenCalledWith(
          MOCK_ITEM_CARD,
          MOCK_ITEM_INDEX,
          MOCK_SEARCH_ID
        );
      });
    });

    describe('when click on favourite item card', () => {
      describe('and item is not favourite', () => {
        beforeEach(() => {
          spyOn(searchListTrackingEventsService, 'trackFavouriteItemEvent');
          searchResponseExtraDataSubject.next({ searchId: MOCK_SEARCH_ID, sortBy: SORT_BY.DISTANCE });
          itemsSubject.next([MOCK_ITEM_CARD]);
          fixture.detectChanges();
        });

        it('should track favourite item event', () => {
          const publicItemCard = fixture.debugElement.query(By.css(itemCardListTag));
          const MOCK_ITEM_CARD_FAVOURITED = { ...MOCK_ITEM_CARD, flags: { favorite: true } };

          publicItemCard.triggerEventHandler('toggleFavouriteEvent', MOCK_ITEM_CARD_FAVOURITED);

          expect(searchListTrackingEventsService.trackFavouriteItemEvent).toHaveBeenCalledWith(MOCK_ITEM_CARD_FAVOURITED, MOCK_SEARCH_ID);
        });
      });

      describe('and item is already favourite', () => {
        beforeEach(() => {
          spyOn(searchListTrackingEventsService, 'trackUnfavouriteItemEvent');
          searchResponseExtraDataSubject.next({ searchId: MOCK_SEARCH_ID, sortBy: SORT_BY.DISTANCE });
          itemsSubject.next([MOCK_ITEM_CARD]);
          fixture.detectChanges();
        });

        it('should track unfavourite item event', () => {
          const publicItemCard = fixture.debugElement.query(By.css(itemCardListTag));
          const MOCK_ITEM_CARD_NOT_FAVOURITED = { ...MOCK_ITEM_CARD, flags: { favorite: false } };

          publicItemCard.triggerEventHandler('toggleFavouriteEvent', MOCK_ITEM_CARD_NOT_FAVOURITED);

          expect(searchListTrackingEventsService.trackUnfavouriteItemEvent).toHaveBeenCalledWith(MOCK_ITEM_CARD_NOT_FAVOURITED);
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

    describe('when new search is performed', () => {
      describe('and searchId should be reset', () => {
        const oldSearchId = 'oldSearchId';
        const newSearchId = 'newSearchId';

        beforeEach(() => {
          spyOn(searchTrackingEventsService, 'trackSearchEvent');
        });

        it('should send search event', () => {
          searchResponseExtraDataSubject.next({ searchId: oldSearchId, sortBy: SORT_BY.DISTANCE });
          component['resetSearchId'] = true;
          searchResponseExtraDataSubject.next({ searchId: newSearchId, sortBy: SORT_BY.DISTANCE });

          expect(searchTrackingEventsService.trackSearchEvent).toHaveBeenCalledWith(
            newSearchId,
            filterParameterStoreService.getParameters()
          );
        });
      });

      describe('and searchId should not be reset', () => {
        const oldSearchId = 'oldSearchId';
        const newSearchId = 'newSearchId';

        beforeEach(() => {
          spyOn(searchTrackingEventsService, 'trackSearchEvent');
        });

        it('should send search event', () => {
          searchResponseExtraDataSubject.next({ searchId: oldSearchId, sortBy: SORT_BY.DISTANCE });
          component['resetSearchId'] = false;
          searchResponseExtraDataSubject.next({ searchId: newSearchId, sortBy: SORT_BY.DISTANCE });

          expect(searchTrackingEventsService.trackSearchEvent).toHaveBeenCalledWith(
            oldSearchId,
            filterParameterStoreService.getParameters()
          );
        });
      });

      describe('and searchResponseExtraData sortBy has value', () => {
        beforeEach(() => {
          spyOn(component['sortBySubject'], 'next');
          searchResponseExtraDataSubject.next({ searchId: '', sortBy: SORT_BY.DISTANCE });
        });

        it('should update the value', () => {
          expect(component['sortBySubject'].next).toHaveBeenCalledWith(SORT_BY.DISTANCE);
        });
      });

      describe('and the search is a wall (without searchId)', () => {
        beforeEach(() => {
          spyOn(searchTrackingEventsService, 'trackSearchEvent');
          searchResponseExtraDataSubject.next({ searchId: null, sortBy: SORT_BY.DISTANCE });
        });

        it('should NOT send search event', () => {
          expect(searchTrackingEventsService.trackSearchEvent).not.toHaveBeenCalled();
        });

        it('should set searchId reset status', () => {
          expect(component['resetSearchId']).toBeTruthy();
        });

        describe('and a click item card is performed', () => {
          it('should send track click item card event with no searchId', () => {
            spyOn(searchListTrackingEventsService, 'trackClickItemCardEvent');

            component.trackClickItemCardEvent({ itemCard: MOCK_ITEM_CARD, index: MOCK_ITEM_INDEX });

            expect(searchListTrackingEventsService.trackClickItemCardEvent).toHaveBeenCalledWith(MOCK_ITEM_CARD, MOCK_ITEM_INDEX, null);
          });
        });

        describe('and a favourite item is performed', () => {
          it('should send favourite item event with no searchId', () => {
            spyOn(searchListTrackingEventsService, 'trackFavouriteItemEvent');
            const favItem = { ...MOCK_ITEM_CARD, flags: { ...MOCK_ITEM_CARD.flags, favorite: true } };

            component.trackFavouriteToggleEvent(favItem);

            expect(searchListTrackingEventsService.trackFavouriteItemEvent).toHaveBeenCalledWith(favItem, null);
          });
        });
      });
    });

    describe('when a search with keyword is performed', () => {
      const keyword = 'keyword';

      beforeAll(() => {
        component.setResetSearchId(false);
        parametersSubject.next([{ key: FILTER_QUERY_PARAM_KEY.keywords, value: keyword }]);
      });

      describe('and the keyword is different', () => {
        it('searchId should be reset', () => {
          expect(component['resetSearchId']).toBeTruthy();
        });
      });

      describe('and the keyword is the same', () => {
        it('searchId should NOT be reset', () => {
          component.setResetSearchId(false);
          parametersSubject.next([{ key: FILTER_QUERY_PARAM_KEY.keywords, value: keyword }]);

          expect(component['resetSearchId']).toBeFalsy();
        });
      });
    });

    describe('when the user has permissions to view ads', () => {
      beforeEach(() => {
        itemsSubject.next([MOCK_ITEM_CARD]);
      });

      it('should load the correct ad slots placeholder', fakeAsync(() => {
        component.device = DeviceType.DESKTOP;

        fixture.detectChanges();
        tick();
        const adSlotGroupMobile = fixture.debugElement.queryAll(By.directive(AdComponentStub));

        const topBanner = adSlotGroupMobile[0].componentInstance;
        const pos1Right = adSlotGroupMobile[1].componentInstance;
        const pos2Right = adSlotGroupMobile[2].componentInstance;

        expect(topBanner.adSlot.name).toBe('130868815/Desktop_Search/Topbanner');
        expect(pos1Right.adSlot.name).toBe('130868815/Desktop_Search/Pos1_Right');
        expect(pos2Right.adSlot.name).toBe('130868815/Desktop_Search/Pos2_Right');
      }));

      describe('when the search has a keyword applied', () => {
        it('should show the Google shopping Ads at the bottom of the page', fakeAsync(() => {
          component.device = DeviceType.DESKTOP;

          parametersSubject.next([{ key: FILTER_QUERY_PARAM_KEY.keywords, value: 'iPhone' }]);
          fixture.detectChanges();
          tick();

          const shoppingSlotGroup = fixture.debugElement.query(By.directive(AdSlotGroupShoppingComponentStub));

          expect(shoppingSlotGroup).toBeTruthy();
        }));
      });

      describe('when the page goes from foreground to background', () => {
        it('should clear ad slots', () => {
          spyOn(searchAdsServiceMock, 'clearSlots');

          component.onDetach();

          expect(searchAdsServiceMock.clearSlots).toHaveBeenCalledTimes(1);
        });
      });

      describe('if the device is a mobile', () => {
        it('should load 3 ads placeholders', fakeAsync(() => {
          component.device = DeviceType.MOBILE;

          fixture.detectChanges();
          tick();
          const adSlotGroupMobile = fixture.debugElement.queryAll(By.directive(AdComponentStub));

          expect(adSlotGroupMobile.length).toBe(3);
        }));
        it('should load the correct ad slots placeholder', fakeAsync(() => {
          component.device = DeviceType.MOBILE;

          fixture.detectChanges();
          tick();
          const adSlotGroupMobile = fixture.debugElement.queryAll(By.directive(AdComponentStub));
          const topBanner = adSlotGroupMobile[0].componentInstance;
          const inlineAd = adSlotGroupMobile[1].componentInstance;
          const bottomAd = adSlotGroupMobile[2].componentInstance;

          expect(topBanner.adSlot.name).toBe('130868815/Web_Mobile_Search/Topbanner');
          expect(inlineAd.adSlot.name).toBe('130868815/Web_Mobile_Search/Pos1');
          expect(bottomAd.adSlot.name).toBe('130868815/Web_Mobile_Search/Pos2');
        }));

        it('should show an Ad placement just after the view more button', fakeAsync(() => {
          component.device = DeviceType.MOBILE;

          fixture.detectChanges();
          tick();
          const bottomAdSlot = fixture.debugElement.query(By.css('.ItemCardList__sky-bottom')).query(By.directive(AdComponentStub));

          expect(bottomAdSlot).toBeTruthy();
        }));
      });
    });

    describe('when sort by relevance is applied', () => {
      beforeEach(() => {
        component['sortBySubject'].next(SORT_BY.RELEVANCE);
      });

      it('should show info bubble', () => {
        const infoBubbleElement = fixture.debugElement.query(By.css(infoBubbleSelector));

        component.sortBy$.subscribe(() => {
          expect(infoBubbleElement).toBeTruthy();
        });
      });

      it('info bubble should have the correct text ', () => {
        const infoBubbleText = 'infoBubbleText';

        searchResponseExtraDataSubject.next({ searchId: '', bubble: infoBubbleText, sortBy: SORT_BY.RELEVANCE });

        expect(component.infoBubbleText).toEqual(infoBubbleText);
      });
    });

    describe('when sort by relevance is NOT applied', () => {
      it('should hide info bubble', () => {
        const infoBubbleElement = fixture.debugElement.query(By.css(infoBubbleSelector));

        expect(infoBubbleElement).toBeFalsy();
      });
    });
  });

  describe('when the user has no permissions to view ads', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [NgxPermissionsRestrictStubDirective],
      }).compileComponents();

      fixture = TestBed.createComponent(SearchComponent);
      searchListTrackingEventsService = TestBed.inject(SearchListTrackingEventsService);
      searchTrackingEventsService = TestBed.inject(SearchTrackingEventsService);
      filterParameterStoreService = TestBed.inject(FilterParameterStoreService);

      component = fixture.componentInstance;
    });

    it('no ad should render', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const shoppingSlotGroup = fixture.debugElement.query(By.directive(AdComponentStub));

      expect(shoppingSlotGroup).toBeFalsy();
    }));

    describe('when the search has a keyword applied', () => {
      it('no ad should render', fakeAsync(() => {
        component.device = DeviceType.DESKTOP;

        parametersSubject.next([{ key: FILTER_QUERY_PARAM_KEY.keywords, value: 'iPhone' }]);
        fixture.detectChanges();
        tick();

        const shoppingSlotGroup = fixture.debugElement.query(By.directive(AdSlotGroupShoppingComponentStub));

        expect(shoppingSlotGroup).toBeFalsy();
      }));
    });

    describe('if the device is a mobile', () => {
      it('no ad should render', fakeAsync(() => {
        component.device = DeviceType.MOBILE;

        fixture.detectChanges();
        tick();
        const bottomAdSlot = fixture.debugElement.query(By.css('.ItemCardList__sky-bottom')).query(By.directive(AdComponentStub));

        expect(bottomAdSlot).toBeFalsy();
      }));
    });
  });

  describe('when no permission testing is involved ', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(SearchComponent);
      searchListTrackingEventsService = TestBed.inject(SearchListTrackingEventsService);
      searchTrackingEventsService = TestBed.inject(SearchTrackingEventsService);
      filterParameterStoreService = TestBed.inject(FilterParameterStoreService);

      component = fixture.componentInstance;
      component.ngOnInit();
    });

    describe('when sort by relevance is applied', () => {
      beforeEach(() => {
        component['sortBySubject'].next(SORT_BY.RELEVANCE);
      });

      it('should show info bubble', () => {
        const infoBubbleElement = fixture.debugElement.query(By.css(infoBubbleSelector));

        component.sortBy$.subscribe(() => {
          expect(infoBubbleElement).toBeTruthy();
        });
      });

      it('info bubble should have the correct text ', () => {
        const infoBubbleText = 'infoBubbleText';

        searchResponseExtraDataSubject.next({ searchId: '', bubble: infoBubbleText, sortBy: SORT_BY.RELEVANCE });

        expect(component.infoBubbleText).toEqual(infoBubbleText);
      });
    });

    describe('when sort by relevance is NOT applied', () => {
      it('should hide info bubble', () => {
        const infoBubbleElement = fixture.debugElement.query(By.css(infoBubbleSelector));

        expect(infoBubbleElement).toBeFalsy();
      });
    });

    describe('when filter parameters change', () => {
      beforeEach(() => {
        component.ngOnInit();
      });

      describe('and have category', () => {
        const categoryFilter: FilterParameter = {
          key: FILTER_QUERY_PARAM_KEY.categoryId,
          value: '1234',
        };

        beforeEach(() => {
          parametersSubject.next([categoryFilter]);
        });

        it('categoryId should be updated', (done) => {
          component.categoryId$.subscribe((categoryId) => {
            expect(categoryId).toEqual(categoryFilter.value);
            done();
          });
        });
      });

      describe('and not have category', () => {
        beforeEach(() => {
          parametersSubject.next([]);
        });

        it('categoryId should be updated', (done) => {
          component.categoryId$.subscribe((categoryId) => {
            expect(categoryId).toBeUndefined();
            done();
          });
        });
      });

      describe('and have object type', () => {
        const objectTypeFilter: FilterParameter = {
          key: FILTER_QUERY_PARAM_KEY.objectType,
          value: '1234',
        };

        beforeEach(() => {
          parametersSubject.next([objectTypeFilter]);
        });

        it('objectTypeId should be updated', (done) => {
          component.objectTypeId$.subscribe((objectTypeId) => {
            expect(objectTypeId).toEqual(objectTypeFilter.value);
            done();
          });
        });
      });

      describe('and not have object type', () => {
        beforeEach(() => {
          parametersSubject.next([]);
        });

        it('objectTypeId should be updated', (done) => {
          component.objectTypeId$.subscribe((objectTypeId) => {
            expect(objectTypeId).toBeUndefined();
            done();
          });
        });
      });
    });
  });
});
