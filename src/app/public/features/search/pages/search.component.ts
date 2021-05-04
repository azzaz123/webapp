import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdShoppingPageOptions } from '@core/ads/models/ad-shopping-page.options';
import { AdSlotGroupShoppingConfiguration } from '@core/ads/models/ad-slot-shopping-configuration';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { PublicFooterService } from '@public/core/services/footer/public-footer.service';
import { CARD_TYPES } from '@public/shared/components/item-card-list/enums/card-types.enum';
import { ColumnsConfig } from '@public/shared/components/item-card-list/interfaces/cols-config.interface';
import { SlotsConfig } from '@public/shared/components/item-card-list/interfaces/slots-config.interface';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { AdSlotSearch, AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { AdShoppingChannel } from '../core/ads/shopping/ad-shopping-channel';
import {
  AdShoppingPageOptionPublicSearchFactory,
  AD_SHOPPING_CONTAINER_PUBLIC_SEARCH,
  AD_SHOPPING_PUBLIC_SEARCH,
} from '../core/ads/shopping/search-ads-shopping.config';
import { SearchAdsService } from './../core/ads/search-ads.service';
import { SearchService } from './../core/services/search.service';
import { SLOTS_CONFIG_DESKTOP, SLOTS_CONFIG_MOBILE } from './search.config';

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

@Component({
  selector: 'tsl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  // TODO: TechDebt: changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
  private loadMoreProductsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private subscription: Subscription = new Subscription();
  public isLoadingResults$: Observable<boolean> = this.searchService.isLoadingResults$;
  public isLoadingPaginationResults$: Observable<boolean> = this.searchService.isLoadingPaginationResults$;
  public currentCategoryId$: Observable<string> = this.searchService.currentCategoryId$;
  public items$: Observable<ItemCard[]> = this.searchService.items$;
  public hasMoreItems$: Observable<boolean> = this.searchService.hasMore$;
  public adSlots: AdSlotSearch = AD_PUBLIC_SEARCH;
  public device: DeviceType;
  public DevicesType: typeof DeviceType = DeviceType;

  public infiniteScrollDisabled$: Observable<boolean> = this.buildInfiniteScrollDisabledObservable();
  public listCardType$: Observable<CARD_TYPES> = this.buildCardTypeObservable();
  public listColumnsConfig$: Observable<ColumnsConfig> = this.buildListConfigObservable();
  public showPlaceholder$: Observable<boolean> = this.buildShowPlaceholderObservable();
  public searchWithoutResults$: Observable<boolean> = this.buildSearchWithoutResultsObservable();

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

  constructor(
    private deviceService: DeviceService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private publicFooterService: PublicFooterService,
    private searchAdsService: SearchAdsService
  ) {
    this.device = this.deviceService.getDeviceType();
    this.subscription.add(this.currentCategoryId$.pipe(distinctUntilChanged()).subscribe(() => this.loadMoreProductsSubject.next(false)));
  }

  public ngOnInit(): void {
    this.slotsConfig = this.deviceService.isMobile() ? SLOTS_CONFIG_MOBILE : SLOTS_CONFIG_DESKTOP;
    this.searchService.searchId$.subscribe((searchId: string) => {
      console.log('searchId tt', searchId);
    });
    this.route.data.subscribe((n) => {
      console.log('date', n);
    });
    this.searchAdsService.setSlots();
  }

  public ngOnDestroy(): void {
    this.searchService.close();
    this.searchAdsService.close();
    this.publicFooterService.setShow(true);
    this.subscription.unsubscribe();
  }

  public loadMoreProducts(): void {
    this.loadMoreProductsSubject.next(true);
    this.scrolled();
  }

  public scrolled(): void {
    this.searchService.loadMore();
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
}
