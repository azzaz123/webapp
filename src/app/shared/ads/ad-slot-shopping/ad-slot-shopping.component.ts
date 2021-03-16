import { AfterViewInit, Component, Input } from '@angular/core';
import { AdShoppingPageOptions, AdSlotShoppingConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';

@Component({
  selector: 'tsl-sky-shopping',
  templateUrl: 'ad-slot-shopping.component.html',
  styleUrls: ['./ad-slot-shopping.component.scss'],
})
export class AdSlotShoppingComponent implements AfterViewInit {
  @Input() adShoppingPageOptions: AdShoppingPageOptions;
  @Input() adSlotShopping: AdSlotShoppingConfiguration;

  constructor(private adsService: AdsService) {}

  ngAfterViewInit(): void {
    this.adsService.displayAdShopping(this.adShoppingPageOptions, this.adSlotShopping);
  }
}
