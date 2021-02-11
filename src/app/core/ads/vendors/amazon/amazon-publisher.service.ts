import { Inject, Injectable } from '@angular/core';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { Observable, Subscriber } from 'rxjs';
import { AdSlot } from '../../models';
import { AmazonPublisherServiceLibrary, AmazonPublisherServiceMapper } from './amazon-publisher-service.model';

@Injectable({
  providedIn: 'root',
})
export class AmazonPublisherService {
  static bidTimeout = 2000;

  get apstag(): AmazonPublisherServiceLibrary {
    return this.window['apstag'];
  }

  constructor(@Inject(WINDOW_TOKEN) private window: Window) {}

  public requestBid(adSlots: AdSlot[]): Observable<void> {
    return new Observable((observer: Subscriber<void>) => {
      const config = {
        slots: AmazonPublisherServiceMapper(adSlots),
        timeout: AmazonPublisherService.bidTimeout,
      };
      this.apstag.fetchBids(config, () => {
        this.apstag.setDisplayBids();
        observer.complete();
      });
    });
  }

  public isLibraryRefDefined(): boolean {
    if (this.apstag) {
      this.init();
    }
    return !!this.apstag;
  }

  private init(): void {
    this.apstag.init({
      pubID: '3703',
      adServer: 'googletag',
      gdpr: {
        cmpTimeout: 1000,
      },
    });
  }
}
