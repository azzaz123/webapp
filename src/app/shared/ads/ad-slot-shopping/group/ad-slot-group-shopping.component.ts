import { AfterViewInit, Component, Input } from '@angular/core';
import { AdShoppingPageOptions, AdSlotGroupShoppingConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';

@Component({
  selector: 'tsl-sky-slot-group-shopping',
  templateUrl: 'ad-slot-group-shopping.component.html',
  styleUrls: ['./ad-slot-group-shopping.component.scss'],
})
export class AdSlotGroupShoppingComponent {
  @Input() adShoppingPageOptions: AdShoppingPageOptions;
  @Input() adSlotShoppingConfiguration: AdSlotGroupShoppingConfiguration;
}
