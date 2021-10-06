import { AfterViewInit, ContentChildren, Directive, Input, QueryList } from '@angular/core';
import { AdShoppingPageOptions } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { AdShoppingChannel } from '@public/features/search/core/ads/shopping/ad-shopping-channel';
import { AdShoppingPageOptionPublicSearchFactory } from '@public/features/search/core/ads/shopping/search-ads-shopping.config';
import { AdSlotShoppingComponent } from './ad-slot-shopping.component';

@Directive({
  selector: '[tslAdSlotShopping]',
})
export class AdSlotShoppingDirective implements AfterViewInit {
  @ContentChildren(AdSlotShoppingComponent, { descendants: true }) slotsQuery!: QueryList<AdSlotShoppingComponent>;

  public adShoppingNativeListPageOptions: AdShoppingPageOptions = AdShoppingPageOptionPublicSearchFactory(
    AdShoppingChannel.SEARCH_LIST_SHOPPING
  );

  constructor(private adsService: AdsService) {}

  public ngAfterViewInit(): void {
    this.slotsQuery.changes.subscribe((components: AdSlotShoppingComponent[]) => {
      if (components.length) {
        const filteredComponents = components.filter((component) => !component.adSlotLoaded);

        const adBlocks = filteredComponents.map((component) => component.adSlotShoppingConfiguration);
        const pageOptions = this.adShoppingNativeListPageOptions;

        if (adBlocks.length > 0) {
          this.adsService.displayAdShopping(pageOptions, adBlocks);
          this.setAdShoppingSlotAsLoaded(filteredComponents);
        }
      }
    });
  }

  private setAdShoppingSlotAsLoaded(components: AdSlotShoppingComponent[]): void {
    components.forEach((component) => {
      component.adSlotLoaded = true;
    });
  }
}
