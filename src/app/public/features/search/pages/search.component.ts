import { ViewportScroller } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, Scroll } from '@angular/router';
import { AdShoppingPageOptions } from '@core/ads/models/ad-shopping-page.options';
import { AdSlotGroupShoppingConfiguration } from '@core/ads/models/ad-slot-shopping-configuration';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { OnAttach, OnDetach } from '@public/core/directives/public-router-outlet/public-router-outlet.directive';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { PublicFooterService } from '@public/core/services/footer/public-footer.service';
import { CARD_TYPES } from '@public/shared/components/item-card-list/enums/card-types.enum';
import { ClickedItemCard } from '@public/shared/components/item-card-list/interfaces/clicked-item-card.interface';
import { ColumnsConfig } from '@public/shared/components/item-card-list/interfaces/cols-config.interface';
import { SlotsConfig } from '@public/shared/components/item-card-list/interfaces/slots-config.interface';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { delay, distinctUntilChanged, filter, skip, map, tap } from 'rxjs/operators';
import { AdShoppingChannel } from '../core/ads/shopping/ad-shopping-channel';
import {
  AD_SHOPPING_CONTAINER_PUBLIC_SEARCH,
  AD_SHOPPING_PUBLIC_SEARCH,
  AdShoppingPageOptionPublicSearchFactory,
} from '../core/ads/shopping/search-ads-shopping.config';
import { SearchAdsService } from './../core/ads/search-ads.service';
import { SLOTS_CONFIG_DESKTOP, SLOTS_CONFIG_MOBILE } from './search.config';
import { HostVisibilityService } from '@public/shared/components/filters/components/filter-group/components/filter-host/services/host-visibility.service';
import {
  FILTER_PARAMETER_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { SearchQueryStringService } from '@core/search/search-query-string.service';
import { isEqual } from 'lodash-es';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { AdSlotSearch, AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { SearchListTrackingEventsService } from '../core/services/search-list-tracking-events/search-list-tracking-events.service';
import { SearchTrackingEventsService } from '@public/core/services/search-tracking-events/search-tracking-events.service';
import { FILTER_PARAMETERS_SEARCH } from '../core/services/constants/filter-parameters';
import { FILTERS_SOURCE } from '@public/core/services/search-tracking-events/enums/filters-source-enum';
import { debounce } from '@core/helpers/debounce/debounce';
import { SORT_BY_DISTANCE_OPTION } from '../components/sort-filter/services/constants/sort-by-options-constants';
import { SearchResponseExtraData } from '../core/services/interfaces/search-response-extra-data.interface';
import { SearchService } from '../core/services/search.service';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { PERMISSIONS } from '@core/user/user-constants';
import { SORT_BY } from '@api/core/model/lists/sort.enum';
import { SortByService } from '../components/sort-filter/services/sort-by.service';

export const REGULAR_CARDS_COLUMNS_CONFIG: ColumnsConfig = {
  xl: 4,
  lg: 4,
  md: 3,
  sm: 2,
  xs: 2,
};
export const WIDE_CARDS_COLUMNS_CONFIG: ColumnsConfig = {
  xl: 1,
  lg: 1,
  md: 1,
  sm: 1,
  xs: 1,
};

/* eslint-disable  @typescript-eslint/member-ordering */
@Component({
  selector: 'tsl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  // TODO: TechDebt: changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnAttach, OnDetach {
  private resetSearchId = true;
  private sortBySubject: BehaviorSubject<SORT_BY> = new BehaviorSubject<SORT_BY>(SORT_BY.DISTANCE);
  private loadMoreProductsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private subscription: Subscription = new Subscription();
  private searchId: string;
  public isLoadingResults$: Observable<boolean> = this.searchService.isLoadingResults$;
  public isLoadingPaginationResults$: Observable<boolean> = this.searchService.isLoadingPaginationResults$;
  public currentCategoryId$: Observable<string> = this.searchService.currentCategoryId$;
  public newSearch$: Observable<SearchResponseExtraData> = this.searchService.newSearch$;
  public items$: Observable<ItemCard[]> = this.searchService.items$;
  public hasMoreItems$: Observable<boolean> = this.searchService.hasMore$;
  public adSlots: AdSlotSearch = AD_PUBLIC_SEARCH;
  public device: DeviceType;
  public filterOpened: boolean;
  public componentAttached = true;
  public DevicesType: typeof DeviceType = DeviceType;
  public infiniteScrollDisabled$: Observable<boolean> = this.buildInfiniteScrollDisabledObservable();
  public listCardType$: Observable<CARD_TYPES> = this.buildCardTypeObservable();
  public listColumnsConfig$: Observable<ColumnsConfig> = this.buildListConfigObservable();
  public showPlaceholder$: Observable<boolean> = this.buildShowPlaceholderObservable();
  public searchWithoutResults$: Observable<boolean> = this.buildSearchWithoutResultsObservable();
  public searchWithKeyword$: Observable<boolean> = this.buildSearchWithKeywordObservable();
  public sortBy$: Observable<SORT_BY> = this.sortBySubject.asObservable();
  public columnsConfig: ColumnsConfig = {
    xl: 4,
    lg: 4,
    md: 3,
    sm: 2,
    xs: 2,
  };
  public adSlotGroupShoppingConfiguration: AdSlotGroupShoppingConfiguration = AD_SHOPPING_PUBLIC_SEARCH;
  public adSlotShoppingContainer: string = AD_SHOPPING_CONTAINER_PUBLIC_SEARCH;
  public adShoppingGroupPageOptions: AdShoppingPageOptions = AdShoppingPageOptionPublicSearchFactory(AdShoppingChannel.SEARCH_PAGE);
  public adShoppingNativeListPageOptions: AdShoppingPageOptions = AdShoppingPageOptionPublicSearchFactory(
    AdShoppingChannel.SEARCH_LIST_SHOPPING
  );
  public isWall$: Observable<boolean> = this.searchService.isWall$;
  public slotsConfig: SlotsConfig;
  readonly PERMISSIONS = PERMISSIONS;

  public infoBubbleText: string;
  public showInfoBubble = false;

  @HostListener('window:scroll', ['$event'])
  @debounce(500)
  onWindowScroll() {
    if (this.componentAttached) {
      this.resetSearchId = true;
    }
  }

  constructor(
    private deviceService: DeviceService,
    private searchService: SearchService,
    private publicFooterService: PublicFooterService,
    private hostVisibilityService: HostVisibilityService,
    private searchAdsService: SearchAdsService,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private route: ActivatedRoute,
    private queryStringService: SearchQueryStringService,
    private searchNavigatorService: SearchNavigatorService,
    private searchListTrackingEventsService: SearchListTrackingEventsService,
    private searchTrackingEventsService: SearchTrackingEventsService,
    private sortByService: SortByService,
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private filterParameterStore: FilterParameterStoreService
  ) {
    this.device = this.deviceService.getDeviceType();
    this.subscription.add(this.currentCategoryId$.pipe(distinctUntilChanged()).subscribe(() => this.loadMoreProductsSubject.next(false)));
    this.subscription.add(
      this.newSearch$.pipe(skip(1)).subscribe((searchResponseExtraData: SearchResponseExtraData) => {
        if (this.resetSearchId) {
          this.searchId = searchResponseExtraData.searchId;
          this.resetSearchId = false;
        }

        this.handleSearchResponseExtraData(searchResponseExtraData);

        this.searchTrackingEventsService.trackSearchEvent(this.searchId, this.filterParameterStore.getParameters());
      })
    );
  }

  public ngOnInit(): void {
    this.hostVisibilityService.init();
    this.slotsConfig = this.deviceService.isMobile() ? SLOTS_CONFIG_MOBILE : SLOTS_CONFIG_DESKTOP;

    this.searchService.init();
    this.searchAdsService.init();

    this.subscription.add(this.currentCategoryId$.pipe(distinctUntilChanged()).subscribe(() => this.loadMoreProductsSubject.next(false)));
    this.subscription.add(this.restoreScrollAfterNavigationBack().subscribe());
    this.subscription.add(
      this.queryParamsChange().subscribe((params) => {
        if (this.forceSortByDistance(params)) {
          params.push({ key: FILTER_QUERY_PARAM_KEY.orderBy, value: SORT_BY_DISTANCE_OPTION.value });
        }

        if (!this.paramsHaveLocation(params)) {
          this.searchNavigatorService.navigate(
            params,
            (params.find((parameter) => parameter.key === FILTER_PARAMETERS_SEARCH.FILTERS_SOURCE)?.value || null) as FILTERS_SOURCE
          );
        } else {
          this.filterParameterStore.setParameters(params);
        }

        //TODO: Remove this after tests
        const shouldEnableExperimental =
          params.some((p) => p.key === ('experimental' as FILTER_QUERY_PARAM_KEY)) && !localStorage.getItem('experimentalFeatures');
        if (shouldEnableExperimental) {
          localStorage.setItem('experimentalFeatures', 'true');
        }
      })
    );

    this.subscription.add(
      this.filterParameterStore.parameters$
        .pipe(map((params) => params.find((param) => param.key === FILTER_QUERY_PARAM_KEY.orderBy)?.value as SORT_BY))
        .subscribe((sortBy) => {
          this.sortBySubject.next(sortBy);
        })
    );
  }

  public onAttach(): void {
    this.searchAdsService.refreshSlots();
    this.componentAttached = true;
    this.resetSearchId = true;
  }

  public onDetach(): void {
    this.searchAdsService.clearSlots();
    this.componentAttached = false;
  }

  public loadMoreProducts(): void {
    this.loadMoreProductsSubject.next(true);
    this.scrolled();
  }

  public scrolled(): void {
    if (this.componentAttached) {
      this.searchService.loadMore();
    }

    this.resetSearchId = true;
  }

  public trackClickItemCardEvent(clickedItemCard: ClickedItemCard): void {
    const { itemCard, index } = clickedItemCard;
    this.searchListTrackingEventsService.trackClickItemCardEvent(itemCard, index, this.searchId);
  }

  public trackFavouriteToggleEvent(item: ItemCard): void {
    if (item.flags.favorite) {
      this.searchListTrackingEventsService.trackFavouriteItemEvent(item, this.searchId);
    } else {
      this.searchListTrackingEventsService.trackUnfavouriteItemEvent(item);
    }
  }

  public handleFilterOpened(opened: boolean) {
    this.filterOpened = opened;
  }

  private handleSearchResponseExtraData(searchResponseExtraData: SearchResponseExtraData): void {
    const categoryId = this.filterParameterStore.getParametersByKeys([FILTER_QUERY_PARAM_KEY.categoryId])[0]?.value;

    if (searchResponseExtraData.sortBy && this.categoryWithSortByRelevanceEnabled(categoryId)) {
      this.sortBySubject.next(searchResponseExtraData.sortBy);

      const isSortByRelevance = searchResponseExtraData.sortBy === SORT_BY.RELEVANCE;
      this.infoBubbleText = isSortByRelevance ? searchResponseExtraData.bubble : '';
      this.showInfoBubble = isSortByRelevance;
    } else {
      this.showInfoBubble = false;
    }
  }

  private queryParamsChange(): Observable<FilterParameter[]> {
    return this.route.queryParams.pipe(
      filter(() => window.location.pathname === `/${PUBLIC_PATHS.SEARCH}`),
      distinctUntilChanged((prevParams, nextParams) => isEqual(prevParams, nextParams)),
      map((params: Params) => this.queryStringService.mapQueryToFilterParams(params))
    );
  }

  private buildListConfigObservable(): Observable<ColumnsConfig> {
    return this.currentCategoryId$.pipe(map((categoryId) => this.getColumnsConfigByCategory(categoryId)));
  }

  private buildCardTypeObservable(): Observable<CARD_TYPES> {
    return this.currentCategoryId$.pipe(map((categoryId) => this.getCardTypeByCategory(categoryId)));
  }

  private buildInfiniteScrollDisabledObservable(): Observable<boolean> {
    return combineLatest([this.loadMoreProductsSubject.asObservable(), this.hasMoreItems$]).pipe(
      map(([loadMoreProducts, hasMore]: [boolean, boolean]) => !(loadMoreProducts && hasMore)),
      tap((infiniteScrollDisabled: boolean) => this.publicFooterService.setShow(infiniteScrollDisabled))
    );
  }

  private buildShowPlaceholderObservable(): Observable<boolean> {
    return combineLatest([this.items$, this.isLoadingResults$]).pipe(
      map(([items, isLoadingResults]) => items.length === 0 && isLoadingResults)
    );
  }

  private buildSearchWithoutResultsObservable(): Observable<boolean> {
    return combineLatest([this.items$, this.isLoadingResults$]).pipe(
      map(([items, isLoadingResults]) => items.length === 0 && !isLoadingResults)
    );
  }

  private buildSearchWithKeywordObservable(): Observable<boolean> {
    return this.filterParameterStore.parameters$.pipe(
      map((params) => !!params.find((param) => param.key === FILTER_QUERY_PARAM_KEY.keywords))
    );
  }

  private restoreScrollAfterNavigationBack(): Observable<Scroll> {
    // TODO: This is a hack for restoring scroll position after navigation back.
    // On the current date, there is an issue opened in Angular to fix this https://github.com/angular/angular/issues/24547

    return this.router.events.pipe(
      filter((e: any): e is Scroll => e instanceof Scroll),
      delay(0),
      tap((e: Scroll) => {
        if (e.position) {
          this.viewportScroller.scrollToPosition(e.position);
        } else if (e.anchor) {
          this.viewportScroller.scrollToAnchor(e.anchor);
        } else {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      })
    );
  }

  private getColumnsConfigByCategory(categoryId): ColumnsConfig {
    if (+categoryId === CATEGORY_IDS.REAL_ESTATE || +categoryId === CATEGORY_IDS.CAR) {
      return WIDE_CARDS_COLUMNS_CONFIG;
    }
    return REGULAR_CARDS_COLUMNS_CONFIG;
  }

  private getCardTypeByCategory(categoryId): CARD_TYPES {
    if (+categoryId === CATEGORY_IDS.CAR || +categoryId === CATEGORY_IDS.REAL_ESTATE) {
      return CARD_TYPES.WIDE;
    }
    return CARD_TYPES.REGULAR;
  }

  private paramsHaveLocation(params: FilterParameter[]): boolean {
    return (
      params.filter((param) => param.key === FILTER_QUERY_PARAM_KEY.latitude || param.key === FILTER_QUERY_PARAM_KEY.longitude).length === 2
    );
  }

  private paramsHaveSortBy(params: FilterParameter[]): boolean {
    return params.some((param) => param.key === FILTER_QUERY_PARAM_KEY.orderBy);
  }

  private categoryWithSortByRelevanceEnabled(categoryId: string): boolean {
    return categoryId !== CATEGORY_IDS.CAR.toString() && categoryId !== CATEGORY_IDS.REAL_ESTATE.toString();
  }

  private paramsHaveKeywords(params: FilterParameter[]): boolean {
    return params.some((param) => param.key === FILTER_QUERY_PARAM_KEY.keywords);
  }

  private forceSortByDistance(params: FilterParameter[]): boolean {
    const categoryId = params.find((param) => param.key === FILTER_QUERY_PARAM_KEY.categoryId)?.value;

    return !this.paramsHaveSortBy(params) && this.paramsHaveKeywords(params) && this.categoryWithSortByRelevanceEnabled(categoryId);
  }
}
