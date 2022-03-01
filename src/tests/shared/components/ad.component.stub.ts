import { Component, Input } from '@angular/core';
import { AdSlotConfiguration } from '@core/ads/models';

@Component({
  selector: 'tsl-sky',
  template: '{{adSlot}}',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class AdComponentStub {
  @Input() adSlot: AdSlotConfiguration;
}
