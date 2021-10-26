import { Injectable } from '@angular/core';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { Observable, ReplaySubject } from 'rxjs';
import { OptimizeService } from '../../vendors/optimize/optimize.service';
import { EXPERIMENTATION_SOURCES } from '@core/experimentation/constants';
import { Variant } from '@core/experimentation/models';

@Injectable({
  providedIn: 'root',
})
export class ExperimentationService {
  constructor(private loadExternalLibService: LoadExternalLibsService, private optimizeService: OptimizeService) {}

  private readonly _experimentReady$: ReplaySubject<void> = new ReplaySubject<void>();

  public get experimentReady$(): Observable<void> {
    return this._experimentReady$.asObservable();
  }

  public initialize(): void {
    this.loadExternalLibService.loadScriptBySource(EXPERIMENTATION_SOURCES).subscribe(() => {
      this._experimentReady$.next();
    });
  }

  public getVariant(id: string): Variant {
    return this.optimizeService.getVariant(id);
  }
}
