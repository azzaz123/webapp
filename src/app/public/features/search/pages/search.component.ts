import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AdShoppingPageOptions, AdSlotShoppingConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { Item } from '@core/item/item';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { AdSlotSearch, AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { AdShoppingChannel } from '../core/ads/shopping/ad-shopping-channel';
import { AdShoppingPageOptionPublicSearchFactory, AD_SHOPPING_PUBLIC_SEARCH } from '../core/ads/shopping/search-ads-shopping.config';

@Component({
  selector: 'tsl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  public items: Item[];

  public adSlots: AdSlotSearch = AD_PUBLIC_SEARCH;
  public device: DeviceType;
  public DevicesType: typeof DeviceType = DeviceType;

  public showBackdrop = false;

  public adSlotShopping: AdSlotShoppingConfiguration = AD_SHOPPING_PUBLIC_SEARCH;
  public adShoppingPageOptions: AdShoppingPageOptions = AdShoppingPageOptionPublicSearchFactory(AdShoppingChannel.SEARCH_PAGE);

  constructor(private adsService: AdsService, private deviceService: DeviceService) {
    this.device = this.deviceService.getDeviceType();
  }

  public ngOnInit() {
    this.items = Array(50).fill(MOCK_ITEM);

    this.adsService.setAdKeywords({ content: 'Iphone 11' });

    this.adsService.setSlots([this.adSlots.search1, this.adSlots.search2r, this.adSlots.search3r]);
    // @TODO hardcoded the query to test ad shopping "Iphone 11"
  }

  public toggleBubbleFilterBackdrop(active: boolean): void {
    this.showBackdrop = active;
  }
}
