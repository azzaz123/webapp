import { AfterViewInit, Component, Input } from '@angular/core';
import { AdsService } from '@core/ads/ads.service';
import { AdSlotId } from '@core/ads/interfaces';

@Component({
  selector: 'tsl-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.scss'],
})
export class AdComponent implements AfterViewInit {
  @Input() slotid: AdSlotId;

  constructor(private adService: AdsService) {}

  ngAfterViewInit() {
    this.adService.displayAdBySlotId(this.slotid);
  }
}
