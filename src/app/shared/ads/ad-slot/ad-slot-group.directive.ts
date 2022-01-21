import { AfterContentInit, Directive, ContentChildren, QueryList } from '@angular/core';
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
    });
  }
}
