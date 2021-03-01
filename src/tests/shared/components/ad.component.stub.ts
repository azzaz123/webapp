import { Component, Input } from '@angular/core';
import { AdSlot } from '@core/ads/models';

@Component({
  selector: 'tsl-sky',
  template: '{{adSlot}}',
})
export class AdComponentStubComponent {
  @Input() adSlot: AdSlot;
}
