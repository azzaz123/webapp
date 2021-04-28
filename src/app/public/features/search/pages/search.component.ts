import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AdShoppingPageOptions } from '@core/ads/models/ad-shopping-page.options';
import { AdSlotGroupShoppingConfiguration } from '@core/ads/models/ad-slot-shopping-configuration';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { PublicFooterService } from '@public/core/services/footer/public-footer.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { ColumnsConfig } from '@public/shared/components/item-card-list/interfaces/cols-config.interface';
import { SlotsConfig } from '@public/shared/components/item-card-list/interfaces/slots-config.interface';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ADS_NATIVE_SLOTS } from '../core/ads/natives/search-ads-nataive.config';
import { AdSlotSearch, AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { AdShoppingChannel } from '../core/ads/shopping/ad-shopping-channel';
import {
  AdShoppingPageOptionPublicSearchFactory,
  AD_SHOPPING_CONTAINER_PUBLIC_SEARCH,
  AD_SHOPPING_PUBLIC_SEARCH,
} from '../core/ads/shopping/search-ads-shopping.config';
import {
  FilterParameterStoreService,
  FILTER_PARAMETER_STORE_TOKEN,
} from './../../../shared/services/filter-parameter-store/filter-parameter-store.service';
import { AdsNativeSlotSearch } from './../core/ads/natives/search-ads-nataive.config';
import { SearchAdsService } from './../core/ads/search-ads.service';
import { SearchService } from './../core/services/search.service';
import { SLOTS_CONFIG_DESKTOP, SLOTS_CONFIG_MOBILE } from './search.config';

@Component({
  selector: 'tsl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  // TODO: TechDebt: changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
  public isLoadingResults$: Observable<boolean> = this.searchService.isLoadingResults$;
  private loadMoreProductsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public items$: Observable<ItemCard[]> = this.searchService.items$;
  public hasMoreItems$: Observable<boolean> = this.searchService.hasMore$;
  public adSlots: AdSlotSearch = AD_PUBLIC_SEARCH;
  public device: DeviceType;
  public DevicesType: typeof DeviceType = DeviceType;

  public infiniteScrollDisabled$: Observable<boolean> = this.buildInfiniteScrollDisabledObservable();

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
  public adNativeSlotsConfiguration: AdsNativeSlotSearch = ADS_NATIVE_SLOTS;

  public isWall$: Observable<boolean> = this.searchService.isWall$;

  public slotsConfig: SlotsConfig;

  constructor(
    private deviceService: DeviceService,
    private searchService: SearchService,
    private publicFooterService: PublicFooterService,
    private searchAdsService: SearchAdsService,
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private filterParameterStoreService: FilterParameterStoreService
  ) {
    this.device = this.deviceService.getDeviceType();
  }

  public ngOnInit(): void {
    this.slotsConfig = this.deviceService.isMobile() ? SLOTS_CONFIG_MOBILE : SLOTS_CONFIG_DESKTOP;

    this.searchAdsService.setSlots();
  }

  public ngOnDestroy(): void {
    this.searchService.close();
    this.searchAdsService.close();
    this.publicFooterService.setShow(true);
  }

  public loadMoreProducts(): void {
    this.loadMoreProductsSubject.next(true);
    this.scrolled();
  }

  public scrolled(): void {
    this.searchService.loadMore();
  }

  public test(): void {
    this.filterParameterStoreService.setParameters([{ key: FILTER_QUERY_PARAM_KEY.keywords, value: 'patinete' }]);
  }

  private buildInfiniteScrollDisabledObservable(): Observable<boolean> {
    return combineLatest([this.loadMoreProductsSubject.asObservable(), this.hasMoreItems$]).pipe(
      map(([loadMoreProducts, hasMore]: [boolean, boolean]) => !(loadMoreProducts && hasMore)),
      tap((infiniteScrollDisabled: boolean) => this.publicFooterService.setShow(infiniteScrollDisabled))
    );
  }
}
