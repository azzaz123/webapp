import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdShoppingPageOptions } from '@core/ads/models/ad-shopping-page.options';
import { AdSlotShoppingConfiguration } from '@core/ads/models/ad-slot-shopping-configuration';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { ColumnsConfig } from '@public/shared/components/item-card-list/interfaces/cols-config.interface';
import { SlotsConfig } from '@public/shared/components/item-card-list/interfaces/slots-config.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdSlotSearch, AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { AdShoppingChannel } from '../core/ads/shopping/ad-shopping-channel';
import {
  AdShoppingPageOptionPublicSearchFactory,
  AD_SHOPPING_NATIVE_CONTAINER_PUBLIC_SEARCH,
  AD_SHOPPING_PUBLIC_SEARCH,
} from '../core/ads/shopping/search-ads-shopping.config';
import { SearchService } from './../core/services/search.service';
import { SLOTS_CONFIG_DESKTOP, SLOTS_CONFIG_MOBILE } from './search.config';

@Component({
  selector: 'tsl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  // TODO: TechDebt: changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
  public items$: Observable<ItemCard[]> = this.searchService.items$;
  public isLoadingSearchResults$: Observable<boolean> = this.searchService.isLoadingResults$;

  public adSlots: AdSlotSearch = AD_PUBLIC_SEARCH;
  public device: DeviceType;
  public DevicesType: typeof DeviceType = DeviceType;

  public columnsConfig: ColumnsConfig = {
    xl: 4,
    lg: 4,
    md: 3,
    sm: 2,
    xs: 2,
  };

  public adSlotGroupShoppingConfiguration: AdSlotShoppingConfiguration = AD_SHOPPING_PUBLIC_SEARCH;
  public adSlotNativeShoppingContainer: string = AD_SHOPPING_NATIVE_CONTAINER_PUBLIC_SEARCH;
  public adShoppingGroupPageOptions: AdShoppingPageOptions = AdShoppingPageOptionPublicSearchFactory(AdShoppingChannel.SEARCH_PAGE);
  public adShoppingNativeListPageOptions: AdShoppingPageOptions = AdShoppingPageOptionPublicSearchFactory(
    AdShoppingChannel.SEARCH_LIST_SHOPPING
  );

  private openBubbleCountSubject = new BehaviorSubject<number>(0);
  public openBubbleCount$: Observable<number> = this.openBubbleCountSubject.asObservable();
  public slotsConfig: SlotsConfig;

  constructor(private adsService: AdsService, private deviceService: DeviceService, private searchService: SearchService) {
    this.device = this.deviceService.getDeviceType();
    this.searchService.init();
  }

  public ngOnInit(): void {
    this.slotsConfig = this.deviceService.isMobile() ? SLOTS_CONFIG_MOBILE : SLOTS_CONFIG_DESKTOP;
    this.adsService.setAdKeywords({ content: 'Iphone 11' });

    this.adsService.setSlots([this.adSlots.search1, this.adSlots.search2r, this.adSlots.search3r]);
    // @TODO hardcoded the query to test ad shopping "Iphone 11"
  }

  public ngOnDestroy(): void {
    this.searchService.close();
  }

  public toggleBubbleFilterBackdrop(active: boolean): void {
    const count = this.openBubbleCountSubject.getValue();
    this.openBubbleCountSubject.next(active ? count + 1 : count - 1);
  }
}
