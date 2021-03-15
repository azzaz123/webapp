import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AdsService } from '@core/ads/services/ads/ads.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { AdSlotSearch, AD_PUBLIC_SEARCH } from '../core/ads/search-ads.config';
import { SearchStoreService } from '../core/services/search-store.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '@core/item/item';
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

  constructor(private adsService: AdsService, private deviceService: DeviceService, private searchStore: SearchStoreService) {
    this.device = this.deviceService.getDeviceType();
  }

  public ngOnInit(): void {
    this.items$ = this.searchStore.items$.pipe(map(mapSearchItems));

    this.adsService.setSlots([this.adSlots.search1, this.adSlots.search2r, this.adSlots.search3r]);
  }

  public toggleBubbleFilterBackdrop(active: boolean): void {
    this.showBackdrop = active;
  }
}
