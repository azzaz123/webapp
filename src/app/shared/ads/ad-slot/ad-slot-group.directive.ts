import { Directive } from '@angular/core';
import { AfterContentInit, AfterViewInit, ContentChildren, QueryList } from '@angular/core';
import { AdsService } from '@core/ads/services';
import { AdSlotComponent } from '@shared/ads/ad-slot/ad-slot.component';
import { AdSlotConfiguration } from '@core/ads/models';

@Directive({
  selector: '[tslAdSlotGroup]',
})
export class AdSlotGroupDirective implements AfterContentInit, AfterViewInit {
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
      // When handling ads with SRA, we only need to call display once per group, using any of the slots in the group.
      // Check https://developers.google.com/publisher-tag/guides/ad-best-practices for more information
      this.adsService.displayAdBySlotId(this.slotConfigurations[0].id);
    }
  }
}
