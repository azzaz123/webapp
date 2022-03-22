import { Observable, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { NON_PARITY_URLS } from '@configs/non-parity-urls.config';
import { Router, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ParityService {
  private readonly _parityCheck$: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  constructor(private route: Router) {}

  public get parityCheck$(): Observable<boolean> {
    return this._parityCheck$.asObservable();
  }

  public checkIfFeatureExists(): void {
    this.route.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe((event: NavigationEnd) => {
        const { url } = event;
        if (NON_PARITY_URLS.includes(url)) {
          console.log('NO PARITY');
          return;
        }

        this._parityCheck$.next(true);
      });
  }
}
