import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AdSlot, AdSlotId } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class GooglePublisherTagService {
  constructor(private cookieService: CookieService) {}

  public init(adSlots: AdSlot[]): void {
    googletag.cmd.push(() => {
      adSlots.forEach((slot) => {
        googletag
          .defineSlot(slot.name, slot.sizes, slot.id)
          .setTargeting('ad_group', 'ad_opt')
          .setTargeting('ad_h', new Date().getUTCHours().toString())
          .addService(googletag.pubads());
      });
      let publisherId = this.cookieService.get('publisherId');
      publisherId = publisherId ? publisherId : '-1' + Array(31).join('0');
      googletag.pubads().enableSingleRequest();
      googletag.pubads().collapseEmptyDivs();
      googletag.pubads().disableInitialLoad();
      googletag.pubads().setPublisherProvidedId(publisherId);
      googletag.enableServices();
    });
  }

  public displayAdBySlotId(slotId: AdSlotId): void {
    googletag.cmd.push(() => {
      googletag.display(slotId);
    });
  }
}
