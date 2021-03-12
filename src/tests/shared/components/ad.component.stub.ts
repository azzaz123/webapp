import { Component, Input } from '@angular/core';
import { AdSlotConfiguration } from '@core/ads/models';

@Component({
  selector: 'tsl-sky',
  template: '{{adSlot}}',
})
// tslint:disable-next-line: component-class-suffix
export class AdComponentStub {
  @Input() adSlot: AdSlotConfiguration;
}
