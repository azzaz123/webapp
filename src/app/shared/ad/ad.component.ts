import { AfterViewInit, Component, Input } from '@angular/core';
import { AdSlot } from '@core/ads/models';
import { AdsService } from '@core/ads/services';

@Component({
  selector: 'tsl-sky',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss'],
})
export class AdComponent implements AfterViewInit {
  @Input() adSlot: AdSlot;

  constructor(private adsService: AdsService) {}

  ngAfterViewInit() {
    this.adsService.displayAdBySlotId(this.adSlot.id);
  }
}
