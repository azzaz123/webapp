import { AfterContentInit, Directive } from '@angular/core';
import { ContentChildren, QueryList } from '@angular/core';
import { AdsService } from '@core/ads/services';
import { AdSlotComponent } from '@shared/ads/ad-slot/ad-slot.component';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[tslAdSlotGroup]',
})
export class AdSlotGroupDirective implements AfterContentInit {
  @ContentChildren(AdSlotComponent, { descendants: true }) slotsQuery!: QueryList<AdSlotComponent>;

  constructor(private adsService: AdsService) {}

  public ngAfterContentInit(): void {
    this.slotsQuery.changes.pipe(take(1)).subscribe((components: AdSlotComponent[]) => {
      const configurations = components.map((component) => component.adSlot);

      this.adsService.setSlots(configurations);
      console.log('PUMBA');

      if (configurations.length) {
        // When handling ads with SRA, we only need to call display once per group, using any of the slots in the group.
        // Check https://developers.google.com/publisher-tag/guides/ad-best-practices for more information
        this.adsService.displayAdBySlotId(configurations[0].id);
      }
    });
  }
}
