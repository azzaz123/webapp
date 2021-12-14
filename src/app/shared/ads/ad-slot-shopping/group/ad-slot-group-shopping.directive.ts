import { AfterContentInit, Directive } from '@angular/core';
import { AdShoppingPageOptions, AdSlotGroupShoppingConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { AdSlotGroupShoppingComponent } from './ad-slot-group-shopping.component';

@Directive({
  selector: '[tslAdSlotGroupShopping]',
})
export class AdSlotGroupShoppingDirective implements AfterContentInit {
  constructor(private component: AdSlotGroupShoppingComponent, private adsService: AdsService) {}

  public ngAfterContentInit(): void {
    const slotConfig: AdSlotGroupShoppingConfiguration[] = [this.component.adSlotShoppingConfiguration];
    const pageOptions: AdShoppingPageOptions = this.component.adShoppingPageOptions;

    this.adsService.setShoppingSlots({ pageOptions, slotConfig });
  }
}
