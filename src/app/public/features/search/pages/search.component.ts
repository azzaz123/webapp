import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { Item } from '@core/item/item';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { AdSlotSearch, AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';

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

  constructor(private adsService: AdsService, private deviceService: DeviceService) {
    this.device = this.deviceService.getDeviceType();
  }

  public ngOnInit() {
    this.items = Array(100).fill(MOCK_ITEM);

    this.adsService.setSlots([this.adSlots.search1, this.adSlots.search2r, this.adSlots.search3r]);
  }

  public toggleBubbleFilterBackdrop(active: boolean): void {
    this.showBackdrop = active;
  }
}
