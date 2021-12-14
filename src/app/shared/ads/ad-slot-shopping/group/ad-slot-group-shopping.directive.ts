import { AfterContentInit, Directive } from '@angular/core';
import { ContentChildren, QueryList } from '@angular/core';
import { AdShoppingGroupSlotData, AdShoppingPageOptions, AdSlotGroupShoppingConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { map, take } from 'rxjs/operators';
import { AdSlotGroupShoppingComponent } from './ad-slot-group-shopping.component';

@Directive({
  selector: '[tslAdSlotGroupShopping]',
})
export class AdSlotGroupShoppingDirective implements AfterContentInit {
  @ContentChildren(AdSlotGroupShoppingComponent, { descendants: true }) slotsQuery!: QueryList<AdSlotGroupShoppingComponent>;

  constructor(private adsService: AdsService) {}

  public ngAfterContentInit(): void {
    this.slotsQuery.changes
      .pipe(take(1))
      .pipe(map((components: AdSlotGroupShoppingComponent[]) => components))
      .subscribe((components) => {
        const slotConfig: AdSlotGroupShoppingConfiguration[] = components.map((component) => component.adSlotShoppingConfiguration);
        const pageOptions: AdShoppingPageOptions = this.getPageOptions(components);

        const groupSlotData: AdShoppingGroupSlotData = {
          pageOptions,
          slotConfig,
        };

        this.adsService.setShoppingSlots(groupSlotData);
      });
  }

  private getPageOptions(components: AdSlotGroupShoppingComponent[]): AdShoppingPageOptions {
    const pageOptions: AdShoppingPageOptions[] = components.map((component) => component.adShoppingPageOptions);

    return pageOptions[0];
  }
}
