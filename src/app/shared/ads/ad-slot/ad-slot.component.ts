import { AfterViewInit, Component, Input } from '@angular/core';
import { AdSlotConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';

@Component({
  selector: 'tsl-sky',
  templateUrl: './ad-slot.component.html',
  styleUrls: ['./ad-slot.component.scss'],
})
export class AdSlotComponent implements AfterViewInit {
  @Input() adSlot: AdSlotConfiguration;

  constructor(private adsService: AdsService) {}

  ngAfterViewInit() {
    this.adsService.displayAdBySlotId(this.adSlot.id);
  }
}
