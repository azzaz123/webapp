import { CriteoLibrary } from './criteo.interface';
import { Observable, Subscriber } from 'rxjs';

import { Inject, Injectable } from '@angular/core';

import { AD_SLOT_NETWORK_ID } from '../../constants';
import { WINDOW_TOKEN } from '@core/window/window.token';

@Injectable({
  providedIn: 'root',
})
export class CriteoService {
  get criteo(): CriteoLibrary {
    return this.window['Criteo'];
  }

  constructor(@Inject(WINDOW_TOKEN) private window: Window) {}

  public requestBid(): Observable<void> {
    return new Observable((observer: Subscriber<void>) => {
      this.criteo.events.push(() => {
        this.criteo.RequestBidsOnGoogleTagSlots(
          AD_SLOT_NETWORK_ID,
          () => {
            this.criteo.SetDFPKeyValueTargeting();
            observer.complete();
          },
          1000
        );
      });
    });
  }

  public isLibraryRefDefined(): boolean {
    return !!this.criteo;
  }
}
