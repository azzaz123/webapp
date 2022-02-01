import { Injectable } from '@angular/core';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { OptimizeService } from '../../vendors/optimize/optimize.service';
import { EXPERIMENTATION_SOURCES } from '@core/experimentation/constants';
import { Variant } from '@core/experimentation/models';
import { OPTIMIZE_EXPERIMENTS } from '@core/experimentation/vendors/optimize/resources/optimize-experiment-ids';
import { OptimizelyService } from '../../vendors/optimizely/optimizely.service';
import { FlagsParamInterface, TrackParamsInterface } from '../../vendors/optimizely/optimizely.interface';
import { UserService } from '@core/user/user.service';
import { OptimizelyDecision } from '@optimizely/optimizely-sdk';

@Injectable({
  providedIn: 'root',
})
export class ExperimentationService {
  private readonly _experimentReady$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private loadExternalLibService: LoadExternalLibsService,
    private optimizeService: OptimizeService,
    private optimizelyService: OptimizelyService,
    private userService: UserService
  ) {}

  public get experimentReady$(): Observable<boolean> {
    return this._experimentReady$.asObservable();
  }

  public initialize(): void {
    this.userService.isUserReady$.subscribe(() => {
      this.optimizelyService.initialize();
    });
    forkJoin([this.loadExternalLibService.loadScriptBySource(EXPERIMENTATION_SOURCES), this.optimizelyService.isReady$]).subscribe(() => {
      this._experimentReady$.next(true);
    });
  }

  public getOptimizeVariant(id: OPTIMIZE_EXPERIMENTS): Variant {
    return this.optimizeService.getVariant(id);
  }

  public initExperimentContext(attributes): void {
    if (this.userService.isLogged) this.optimizelyService.initExperimentContext(attributes);
  }

  public getVariations({ flagKeys, options }: FlagsParamInterface): { [key: string]: OptimizelyDecision } {
    if (this.userService.isLogged) {
      return this.optimizelyService.getVariations({ flagKeys, options });
    }
  }

  public trackOptimizelyEvent({ eventKey, eventTags }: TrackParamsInterface): void {
    if (this.userService.isLogged) this.optimizelyService.track({ eventKey, eventTags });
  }
}
