import { Component, Input } from '@angular/core';
import { AdSlot } from '@core/ads/models';

@Component({
  selector: 'tsl-ad',
  template: '{{adSlot}}',
})
export class AdComponentStub {
  @Input() adSlot: AdSlot;
}
