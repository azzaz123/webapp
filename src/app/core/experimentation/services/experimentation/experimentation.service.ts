import { Injectable } from '@angular/core';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { OptimizeService } from '../../vendors/optimize/optimize.service';
import { EXPERIMENTATION_SOURCES } from '@core/experimentation/constants';
import { Variant } from '@core/experimentation/models';
import { OPTIMIZE_EXPERIMENTS } from '@core/experimentation/vendors/optimize/resources/optimize-experiment-ids';

@Injectable({
  providedIn: 'root',
})
export class ExperimentationService {
  constructor(private loadExternalLibService: LoadExternalLibsService, private optimizeService: OptimizeService) {}

  private readonly _experimentReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get experimentReady$(): Observable<boolean> {
    return this._experimentReady$.asObservable();
  }

  public initialize(): void {
    this.loadExternalLibService.loadScriptBySource(EXPERIMENTATION_SOURCES).subscribe(() => {
      this._experimentReady$.next(true);
    });
  }

  public getOptimizeVariant(id: OPTIMIZE_EXPERIMENTS): Variant {
    return this.optimizeService.getVariant(id);
  }
}
