import { AfterContentInit, Directive, Input } from '@angular/core';
import { AdShoppingPageOptions, AdSlotGroupShoppingConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';

@Directive({
  selector: '[tslAdSlotGroupShopping]',
})
export class AdSlotGroupShoppingDirective implements AfterContentInit {
  @Input() adSlotShoppingConfiguration: AdSlotGroupShoppingConfiguration;
  @Input() adShoppingPageOptions: AdShoppingPageOptions;

  constructor(private adsService: AdsService) {}

  public ngAfterContentInit(): void {
    const slotConfig: AdSlotGroupShoppingConfiguration[] = [this.adSlotShoppingConfiguration];
    const pageOptions: AdShoppingPageOptions = this.adShoppingPageOptions;

    this.adsService.setShoppingSlots({ pageOptions, slotConfig });
  }
}
