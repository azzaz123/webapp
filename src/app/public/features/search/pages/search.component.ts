import { AdSlotConfiguration } from '@core/ads/models/ad-slot.interface';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { AdsService } from '@core/ads/services/ads/ads.service';
import { Item } from '@core/item/item';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { AD_TOP_PUBLIC_SEARCH } from '../core/ads/search-ads.config';

@Component({
  selector: 'tsl-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  public items: Item[];

  public adSlots: AdSlotConfiguration = AD_TOP_PUBLIC_SEARCH;

  constructor(private adsService: AdsService) {}

  public ngOnInit() {
    this.items = Array(10).fill(MOCK_ITEM);
    this.adsService.setSlots([this.adSlots]);
  }
}
