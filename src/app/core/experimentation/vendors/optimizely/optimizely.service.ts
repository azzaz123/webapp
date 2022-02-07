import { Inject, Injectable } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { UserService } from '@core/user/user.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { environment } from '@environments/environment';
import { Client, OptimizelyDecision, OptimizelyUserContext, enums } from '@optimizely/optimizely-sdk';
import { Observable, BehaviorSubject } from 'rxjs';
import { FlagsParamInterface, OnDecisionCallbackInterface, TrackParamsInterface } from './optimizely.interface';
import { BASE_USER_ATTRIBUTES } from './resources/user-attributes.constants';

@Injectable({
  providedIn: 'root',
})
export class OptimizelyService {
  private readonly _optimizelyReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private optimizelyClientInstance: Client;
  private optimizelyUserContext: OptimizelyUserContext;
  private baseAttributes = BASE_USER_ATTRIBUTES;

  public get isReady$(): Observable<boolean> {
    return this._optimizelyReady$.asObservable();
  }

  constructor(private userService: UserService, private analyticsService: AnalyticsService, @Inject(WINDOW_TOKEN) private window: Window) {}

  public initialize(): void {
    import('@optimizely/optimizely-sdk').then((optimizelySdk) => {
      this.optimizelyClientInstance = optimizelySdk.createInstance({
        sdkKey: environment.optimizelySdkKey,
      });
      this.optimizelyClientInstance.onReady().then(({ success }) => {
        if (success) {
          this.window['optimizelyClientInstance'] = this.optimizelyClientInstance;
          this.optimizelyClientInstance.notificationCenter.addNotificationListener(
            enums.NOTIFICATION_TYPES.DECISION,
            this.onDecision.bind(this)
          );
          this._optimizelyReady$.next(true);
        }
      });
    });
  }

  public initExperimentContext(attributes?: { [key: string]: any }): void {
    if (!this.optimizelyUserContext) {
      const userId = this.userService.user.id;
      this.optimizelyUserContext = this.optimizelyClientInstance.createUserContext(userId, { ...attributes, ...this.baseAttributes });
    } else {
      if (attributes) this.addNewAttributes(attributes);
    }
  }

  public getVariations({ flagKeys, options }: FlagsParamInterface): { [key: string]: OptimizelyDecision } {
    return this.optimizelyUserContext.decideForKeys(flagKeys, options);
  }

  public track({ eventKey, eventTags }: TrackParamsInterface): void {
    this.optimizelyUserContext.trackEvent(eventKey, eventTags);
  }

  private addNewAttributes(attributesToAdd: { [key: string]: string }) {
    const currentUserAttributes = this.optimizelyUserContext.getAttributes();
    const newUserAttributes = Object.keys(attributesToAdd).filter((keyToAdd) => !currentUserAttributes[keyToAdd]);

    newUserAttributes.forEach((key) => {
      this.optimizelyUserContext.setAttribute(key, attributesToAdd[key]);
    });
  }

  private onDecision({ type, userId, attributes, decisionInfo }: OnDecisionCallbackInterface) {
    if (type === 'flag') {
      if (decisionInfo) this.analyticsService.setUserAttribute(decisionInfo.ruleKey, decisionInfo.variationKey);
    }
  }
}
