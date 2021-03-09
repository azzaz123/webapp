import { Component, Input } from '@angular/core';
import { AdSlotConfiguration } from '@core/ads/models';

@Component({
  selector: 'tsl-sky',
  template: '{{adSlot}}',
})
export class AdComponentStub {
  @Input() adSlot: AdSlotConfiguration;
}
