import { Component, Input } from '@angular/core';
import { AdShoppingPageOptions, AdSlotShoppingConfiguration } from '@core/ads/models';

@Component({
  selector: 'tsl-sky-slot-group-shopping',
  template: '{{adShoppingPageOptions}}, {{adSlotShoppingConfiguration}}',
})
// tslint:disable-next-line:component-class-suffix
export class AdSlotGroupShoppingComponentSub {
  @Input() adShoppingPageOptions: AdShoppingPageOptions;
  @Input() adSlotShoppingConfiguration: AdSlotShoppingConfiguration;
}
