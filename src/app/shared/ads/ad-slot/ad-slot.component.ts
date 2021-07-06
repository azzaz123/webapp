import { Component, Input } from '@angular/core';
import { AdSlotConfiguration } from '@core/ads/models';

@Component({
  selector: 'tsl-sky',
  templateUrl: './ad-slot.component.html',
  styleUrls: ['./ad-slot.component.scss'],
})
export class AdSlotComponent {
  @Input() adSlot: AdSlotConfiguration;
}
