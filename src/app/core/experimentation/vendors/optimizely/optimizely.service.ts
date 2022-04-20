import { Inject, Injectable } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { UserService } from '@core/user/user.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { environment } from '@environments/environment';
import { Client, OptimizelyDecision, OptimizelyUserContext, OptimizelyDecideOption } from '@optimizely/optimizely-sdk';
import { Observable, BehaviorSubject } from 'rxjs';
import { FlagsParamInterface } from './optimizely.interface';
import { OPTIMIZELY_EXPERIMENT_KEYS } from './resources/optimizely-experiment-keys';
import { BASE_USER_ATTRIBUTES } from './resources/user-attributes.constants';

/**
 * Do not import this service directly, use the exposed methods in the ExperimentationService.
 * Any change in this file must be reviewed by the Innovation Speed team
 * Documentation on how to use this module: https://wallapop.atlassian.net/wiki/spaces/IS/pages/2548957337/Web+Fullstack+integration+details
 */
@Injectable({
  providedIn: 'root',
})
export class OptimizelyService {
  private readonly _optimizelyReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private optimizelyUserContext: OptimizelyUserContext;
  private optimizelyClientInstance: Client;
  private baseAttributes = BASE_USER_ATTRIBUTES;

  public get isReady$(): Observable<boolean> {
    return this._optimizelyReady$.asObservable();
  }

  constructor(private userService: UserService, private analyticsService: AnalyticsService, @Inject(WINDOW_TOKEN) private window: Window) {}

  public initialize(): void {
    import('@optimizely/optimizely-sdk').then((optimizelySdk) => {
      if (environment.production) {
        optimizelySdk.setLogger(null);
      }
      this.optimizelyClientInstance = optimizelySdk.createInstance({
        sdkKey: environment.optimizelySdkKey,
      });
      this.optimizelyClientInstance.onReady().then(({ success }) => {
        if (success) {
          this.window['optimizelyClientInstance'] = this.optimizelyClientInstance;
          // The datafile needs to be set in the window for the integration kit with mParticle to work
          this.window['optimizelyDatafile'] = JSON.parse(this.optimizelyClientInstance.getOptimizelyConfig().getDatafile());
          this.initExperimentContext();
        } else {
          this.window['optimizelyClientInstance'] = {};
          this.window['optimizelyDatafile'] = {};
        }

        this._optimizelyReady$.next(true);
        this._optimizelyReady$.complete();
      });
    });
  }

  public getVariations({ flagKeys, options }: FlagsParamInterface): { [key: string]: OptimizelyDecision } | {} {
    if (this.optimizelyUserContext) {
      return this.optimizelyUserContext.decideForKeys(flagKeys, options);
    } else {
      return {};
    }
  }

  public setNewOptimizelyUserAttributes(attributesToAdd: { [key: string]: string | number | boolean }) {
    if (this.optimizelyUserContext) {
      const currentUserAttributes = this.optimizelyUserContext.getAttributes();
      const newUserAttributes = Object.keys(attributesToAdd).filter((keyToAdd) => !currentUserAttributes[keyToAdd]);

      newUserAttributes.forEach((key) => {
        this.optimizelyUserContext.setAttribute(key, attributesToAdd[key]);
      });
    }
  }

  private initExperimentContext(): void {
    const userId = this.userService.user.id;
    this.optimizelyUserContext = this.optimizelyClientInstance.createUserContext(userId, { ...this.baseAttributes });
    // Waits for mParticle user to be ready to add experiment attributes
    this.analyticsService.mParticleReady$.subscribe(() => {
      this.addAttributesToMParticle();
    });
  }

  /**
   * This function iterates over all experiments in order to set all experiment keys in mParticle when optimizely is loaded.
   * The DISABLE_DECISION_EVENT option is sent so a visitor isn't registered, thus avoiding polluting the experiment
   */
  private addAttributesToMParticle(): void {
    Object.values(OPTIMIZELY_EXPERIMENT_KEYS).forEach((experimentKey) => {
      const { ruleKey, variationKey } = this.optimizelyUserContext.decide(experimentKey, [OptimizelyDecideOption.DISABLE_DECISION_EVENT]);
      if (ruleKey) this.analyticsService.setUserAttribute(ruleKey, variationKey);
    });
  }
}
