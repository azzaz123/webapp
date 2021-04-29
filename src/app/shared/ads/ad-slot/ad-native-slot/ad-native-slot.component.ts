import { Component, Input, OnInit } from '@angular/core';
import { AdSlotConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services/ads/ads.service';

@Component({
  selector: 'tsl-sky-native',
  templateUrl: 'ad-native-slot.component.html',
  styleUrls: ['./ad-native-slot.component.scss'],
})
export class AdNativeSlotComponent implements OnInit {
  @Input() adSlot: AdSlotConfiguration;
  @Input() index: number;

  constructor(private adService: AdsService) {}

  public ngOnInit(): void {
    const adSlot: AdSlotConfiguration = { ...this.adSlot, id: this.adSlot.id + this.index };
    this.adService.addSlots([adSlot]);
  }
}
