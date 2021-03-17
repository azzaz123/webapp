import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AdShoppingPageOptions } from '@core/ads/models/ad-shopping-page.options';
import { AdSlotShoppingConfiguration } from '@core/ads/models/ad-slot-shopping-configuration';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { Item } from '@core/item/item';
import { ColumnsConfig } from '@public/shared/components/item-card-list/interfaces/cols-config.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdSlotSearch, AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { AdShoppingChannel } from '../core/ads/shopping/ad-shopping-channel';
import {
  AdShoppingPageOptionPublicSearchFactory,
  AD_SHOPPING_NATIVE_CONTAINER_PUBLIC_SEARCH,
  AD_SHOPPING_PUBLIC_SEARCH,
} from '../core/ads/shopping/search-ads-shopping.config';
import { SearchStoreService } from '../core/services/search-store.service';
import { mapSearchItems } from '../utils/search-item.mapper';

@Component({
  selector: 'tsl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  public items$: Observable<Item[]>;

  public adSlots: AdSlotSearch = AD_PUBLIC_SEARCH;
  public device: DeviceType;
  public DevicesType: typeof DeviceType = DeviceType;

  public showBackdrop = false;
  public columnsConfig: ColumnsConfig = {
    lg: 4,
    md: 3,
    sm: 2,
    xs: 2,
  };

  public adSlotShopping: AdSlotShoppingConfiguration = AD_SHOPPING_PUBLIC_SEARCH;
  public adSlotNativeShoppingContainer: string = AD_SHOPPING_NATIVE_CONTAINER_PUBLIC_SEARCH;
  public adShoppingSearchPageOptions: AdShoppingPageOptions = AdShoppingPageOptionPublicSearchFactory(AdShoppingChannel.SEARCH_PAGE);
  public adShoppingNativeListPageOptions: AdShoppingPageOptions = AdShoppingPageOptionPublicSearchFactory(
    AdShoppingChannel.SEARCH_LIST_SHOPPING
  );

  constructor(private adsService: AdsService, private deviceService: DeviceService, private searchStore: SearchStoreService) {
    this.device = this.deviceService.getDeviceType();
  }

  public ngOnInit(): void {
    this.items$ = this.searchStore.items$.pipe(map(mapSearchItems));

    this.adsService.setAdKeywords({ content: 'Iphone 11' });

    this.adsService.setSlots([this.adSlots.search1, this.adSlots.search2r, this.adSlots.search3r]);
    // @TODO hardcoded the query to test ad shopping "Iphone 11"
  }

  public toggleBubbleFilterBackdrop(active: boolean): void {
    this.showBackdrop = active;
  }
}
