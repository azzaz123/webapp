import { AfterContentInit, AfterViewChecked, AfterViewInit, ContentChild, ContentChildren, Directive, QueryList } from '@angular/core';
import { AdsService } from '@core/ads/services';
import { take } from 'rxjs/operators';
import { AdSlotShoppingComponent } from './ad-slot-shopping.component';

@Directive({
  selector: '[tslAdSlotShopping]',
})
export class AdSlotShoppingDirective implements AfterContentInit {
  @ContentChildren(AdSlotShoppingComponent, { descendants: true }) slotsQuery!: QueryList<AdSlotShoppingComponent>;

  constructor(private adsService: AdsService) {}

  public ngAfterContentInit(): void {
    console.log('PUM');
    this.slotsQuery.changes.pipe(take(1)).subscribe((components: AdSlotShoppingComponent[]) => {
      const adBlocks = components.map((component) => component.adSlotShoppingConfiguration);
      const pageOptions = components[0].adShoppingPageOptions;

      this.adsService.displayAdShopping(pageOptions, adBlocks);
    });
  }
}
