import { AfterContentInit, AfterViewInit, Component, ContentChildren, QueryList } from '@angular/core';
import { AdsService } from '@core/ads/services';
import { AdSlotComponent } from '@shared/ads/ad-slot/ad-slot.component';
import { AdSlotConfiguration } from '@core/ads/models';

@Component({
  selector: 'tsl-sky-wrapper',
  templateUrl: './ad-slot-wrapper.component.html',
  styleUrls: ['./ad-slot-wrapper.component.scss'],
})
export class AdSlotWrapperComponent implements AfterContentInit, AfterViewInit {
  @ContentChildren(AdSlotComponent, { descendants: true }) slotsQuery!: QueryList<AdSlotComponent>;

  private slotConfigurations: AdSlotConfiguration[];

  constructor(private adsService: AdsService) {}

  public ngAfterContentInit(): void {
    this.slotConfigurations = this.slotsQuery.toArray().map((component) => component.adSlot);

    if (this.slotConfigurations.length) {
      this.adsService.setSlots(this.slotConfigurations);
    }
  }

  public ngAfterViewInit(): void {
    if (this.slotConfigurations.length) {
      // When handling ads with SRA, we only need to call display once per group.
      // Check https://developers.google.com/publisher-tag/guides/ad-best-practices for more information
      this.adsService.displayAdBySlotId(this.slotConfigurations[0].id);
    }
  }
}
