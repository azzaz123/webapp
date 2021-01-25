import { Observable, Subscriber } from 'rxjs';

import { Injectable } from '@angular/core';

import { AdSlot } from '../../models';
import { AmazonPublisherServiceAdSlot } from './amazon-publisher-service.interface';

@Injectable({
  providedIn: 'root',
})
export class AmazonPublisherService {
  private bidTimeout = 2000;

  public requestBid(adSlots: AdSlot[]): Observable<void> {
    return new Observable((observer: Subscriber<void>) => {
      const config = {
        slots: this.mapAdSlots(adSlots),
        timeout: this.bidTimeout,
      };
      apstag.fetchBids(config, () => observer.complete());
    });
  }

  public isLibraryRefDefined(): boolean {
    if (!!apstag) {
      return false;
    }
    this.init();

    return true;
  }

  private mapAdSlots(adSlots: AdSlot[]): AmazonPublisherServiceAdSlot[] {
    return adSlots.map((slot) => ({
      slotID: slot.id,
      sizes: slot.sizes,
      slotName: slot.name,
    }));
  }

  private init(): void {
    apstag.init({
      pubID: '3703',
      adServer: 'googletag',
      gdpr: {
        cmpTimeout: 1000,
      },
    });
  }
}
