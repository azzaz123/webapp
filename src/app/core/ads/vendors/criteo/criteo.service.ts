import { Observable, Subscriber } from 'rxjs';

import { Injectable } from '@angular/core';

import { AD_SLOT_NETWORK_ID } from '../../constants';

@Injectable({
  providedIn: 'root',
})
export class CriteoService {
  public isLibraryRefDefined(): boolean {
    return !!Criteo;
  }

  public requestBid(): Observable<void> {
    return new Observable((observer: Subscriber<void>) => {
      Criteo.events.push(() => {
        Criteo.RequestBidsOnGoogleTagSlots(
          AD_SLOT_NETWORK_ID,
          () => {
            Criteo.SetDFPKeyValueTargeting();
            observer.complete();
          },
          1000
        );
      });
    });
  }
}
