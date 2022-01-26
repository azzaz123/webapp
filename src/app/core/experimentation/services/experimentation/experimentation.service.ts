import { Injectable } from '@angular/core';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { OptimizeService } from '../../vendors/optimize/optimize.service';
import { EXPERIMENTATION_SOURCES } from '@core/experimentation/constants';
import { Variant } from '@core/experimentation/models';
import { OPTIMIZE_EXPERIMENTS } from '@core/experimentation/vendors/optimize/resources/optimize-experiment-ids';
import { OptimizelyService } from '../../vendors/optimizely/optimizely.service';
import { ExperimentationParamInterface, FeatureParamInterface } from '../../vendors/optimizely/optimizely.interface';

@Injectable({
  providedIn: 'root',
})
export class ExperimentationService {
  private readonly _experimentReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private loadExternalLibService: LoadExternalLibsService,
    private optimizeService: OptimizeService,
    private optimizelyService: OptimizelyService
  ) {}

  public get experimentReady$(): Observable<boolean> {
    return this._experimentReady$.asObservable();
  }

  public initialize(): void {
    this.optimizelyService.initialize();
    forkJoin([this.loadExternalLibService.loadScriptBySource(EXPERIMENTATION_SOURCES), this.optimizelyService.isReady$]).subscribe(() => {
      this._experimentReady$.next(true);
    });
  }

  public getOptimizeVariant(id: OPTIMIZE_EXPERIMENTS): Variant {
    return this.optimizeService.getVariant(id);
  }

  public activateOptimizelyExperiment({ experimentKey, attributes }: ExperimentationParamInterface) {
    return this.optimizelyService.activate({ experimentKey, attributes });
  }

  public getOptimizelyVariation({ experimentKey, attributes }: ExperimentationParamInterface) {
    return this.optimizelyService.getVariation({ experimentKey, attributes });
  }

  public isOptimizelyFeatureEnabled({ featureKey, attributes }: FeatureParamInterface) {
    return this.optimizelyService.isFeatureEnabled({ featureKey, attributes });
  }
}
