import { Injectable } from '@angular/core';
import { LoadExternalLibsService } from '@core/load-external-libs/load-external-libs.service';
import { BehaviorSubject, forkJoin, Observable, Subscription } from 'rxjs';
import { OptimizeService } from '../../vendors/optimize/optimize.service';
import { EXPERIMENTATION_SOURCES } from '@core/experimentation/constants';
import { Variant } from '@core/experimentation/models';
import { OPTIMIZE_EXPERIMENTS } from '@core/experimentation/vendors/optimize/resources/optimize-experiment-ids';
import { OptimizelyService } from '../../vendors/optimizely/optimizely.service';
import { FlagsParamInterface, OPTIMIZELY_FLAG_KEYS } from '../../vendors/optimizely/optimizely.interface';
import { UserService } from '@core/user/user.service';
import { OptimizelyDecision, OptimizelyDecideOption } from '@optimizely/optimizely-sdk';
import { OPTIMIZELY_EXPERIMENT_KEYS } from '@core/experimentation/vendors/optimizely/resources/optimizely-experiment-keys';

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

  public initializeOptimizelyService(): Promise<boolean> {
    this.optimizelyService.initialize();
    return this.optimizelyService.isReady$.toPromise();
  }

  public initializeExperimentationWithAuthenticatedUser(): void {
    forkJoin([this.loadExternalLibService.loadScriptBySource(EXPERIMENTATION_SOURCES), this.optimizelyService.isReady$]).subscribe(() => {
      this._experimentReady$.next(true);
    });
  }

  public initializeExperimentationWithUnauthenticatedUser(): void {
    this.loadExternalLibService.loadScriptBySource(EXPERIMENTATION_SOURCES).subscribe(() => {
      this._experimentReady$.next(true);
    });
  }

  public getOptimizeVariant(id: OPTIMIZE_EXPERIMENTS): Variant {
    return this.optimizeService.getVariant(id);
  }

  public getVariations({ flagKeys, options }: FlagsParamInterface): { [key: string]: OptimizelyDecision } {
    if (this.userService.isLogged) {
      return this.optimizelyService.getVariations({ flagKeys, options });
    }
  }

  public isFlagEnabled(flagKey: OPTIMIZELY_FLAG_KEYS): boolean {
    if (this.userService.isLogged) {
      return this.optimizelyService.getVariations({ flagKeys: [flagKey], options: [OptimizelyDecideOption.DISABLE_DECISION_EVENT] })[
        flagKey
      ]?.enabled;
    }
  }

  public getVariationFromFlag(flagKey: OPTIMIZELY_EXPERIMENT_KEYS): string {
    if (this.userService.isLogged) {
      return this.optimizelyService.getVariations({ flagKeys: [flagKey] })[flagKey]?.variationKey;
    }
  }

  public setNewOptimizelyUserAttributes(attributes: { [key: string]: string }): void {
    if (this.userService.isLogged) {
      this.optimizelyService.setNewOptimizelyUserAttributes(attributes);
    }
  }
}
