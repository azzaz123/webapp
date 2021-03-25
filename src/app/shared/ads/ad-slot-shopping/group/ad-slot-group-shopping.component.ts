import {AfterViewInit, Component, Input} from '@angular/core';
import {AdShoppingPageOptions, AdSlotShoppingConfiguration} from '@core/ads/models';
import {AdsService} from '@core/ads/services';

@Component({
  selector: 'tsl-sky-slot-group-shopping',
  templateUrl: 'ad-slot-group-shopping.component.html',
  styleUrls: ['./ad-slot-group-shopping.component.scss']
})
export class AdSlotGroupShoppingComponent implements AfterViewInit{
  @Input() adShoppingPageOptions: AdShoppingPageOptions;
  @Input() adSlotShoppingConfiguration: AdSlotShoppingConfiguration;

  constructor(private adsService: AdsService) {
  }

  ngAfterViewInit(): void {
    this.adsService.displayAdShopping(this.adShoppingPageOptions, this.adSlotShoppingConfiguration);
  }

}
