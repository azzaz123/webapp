import { Injectable } from '@angular/core';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { Observable, ReplaySubject } from 'rxjs';

export const OPTIMIZE_SRC = 'https://www.googleoptimize.com/optimize.js?id=GTM-5V9QQDK';

@Injectable({
  providedIn: 'root',
})
export class ExperimentationService {
  constructor(private loadExternalLibService: LoadExternalLibsService) {}

  private readonly _experimentReady$: ReplaySubject<void> = new ReplaySubject<void>();

  public get experimentReady$(): Observable<void> {
    return this._experimentReady$.asObservable();
  }

  public initialize() {
    this.loadExternalLibService.loadScriptBySource(OPTIMIZE_SRC).subscribe(() => {
      this._experimentReady$.next();
    });
  }
}
