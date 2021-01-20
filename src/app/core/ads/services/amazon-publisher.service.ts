import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { AdSlot, AdSlotId } from '../interfaces';
import { AmazonPublisherServiceAdSlot } from '../interfaces/amazon-publisher-service.interface';

@Injectable({
  providedIn: 'root',
})
export class AmazonPublisherService {
  private bidTimeout = 2000;

  public init(): void {
    apstag.init({
      pubID: '3703',
      adServer: 'googletag',
      gdpr: {
        cmpTimeout: 1000,
      },
    });
  }

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
    return !!apstag;
  }

  private mapAdSlots(adSlots: AdSlot[]): AmazonPublisherServiceAdSlot[] {
    return adSlots.map((slot) => ({
      slotID: slot.id,
      sizes: slot.sizes,
      slotName: slot.name,
    }));
  }
}
