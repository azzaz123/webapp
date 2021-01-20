import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

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
          6866,
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
