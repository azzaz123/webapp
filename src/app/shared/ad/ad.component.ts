import { AfterViewInit, Component, Input } from '@angular/core';
import { AdsService } from '@core/ads/services';
import { AdSlot } from '@core/ads/interfaces';

@Component({
  selector: 'tsl-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss'],
})
export class AdComponent implements AfterViewInit {
  @Input() adSlot: AdSlot;

  constructor(private adService: AdsService) {}

  ngAfterViewInit() {
    this.adService.displayAdBySlotId(this.adSlot.id);
  }
}
