import { Component, Input } from '@angular/core';
import { AdShoppingPageOptions, AdSlotGroupShoppingConfiguration } from '@core/ads/models';

@Component({
  selector: 'tsl-sky-slot-group-shopping',
  template: '{{adShoppingPageOptions}}, {{adSlotShoppingConfiguration}}',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class AdSlotGroupShoppingComponentStub {
  @Input() adShoppingPageOptions: AdShoppingPageOptions;
  @Input() adSlotShoppingConfiguration: AdSlotGroupShoppingConfiguration;
}
