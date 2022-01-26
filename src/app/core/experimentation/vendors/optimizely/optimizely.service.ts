import { Injectable } from '@angular/core';
import { UserService } from '@core/user/user.service';
import { Client } from '@optimizely/optimizely-sdk';
import { Observable, BehaviorSubject } from 'rxjs';
import { ExperimentationParamInterface, FeatureParamInterface } from './optimizely.interface';
import { SDK_KEY_DEVELOPMENT } from './resources/sdk-keys';

@Injectable({
  providedIn: 'root',
})
export class OptimizelyService {
  private readonly _optimizelyReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private optimizelyClientInstance: Client;

  public get isReady$(): Observable<boolean> {
    return this._optimizelyReady$.asObservable();
  }

  constructor(private userService: UserService) {}

  public initialize(): void {
    if (this.userService.isLogged) {
      import('@optimizely/optimizely-sdk').then((optimizelySdk) => {
        this.optimizelyClientInstance = optimizelySdk.createInstance({
          sdkKey: SDK_KEY_DEVELOPMENT,
        });
        this.optimizelyClientInstance.onReady().then(({ success }) => {
          if (success) this._optimizelyReady$.next(true);
        });
      });
    } else {
      this._optimizelyReady$.next(true);
    }
  }

  public activate({ experimentKey, attributes }: ExperimentationParamInterface) {
    const userId = this.userService?.user?.id;
    return this.optimizelyClientInstance?.activate(experimentKey, userId, attributes);
  }

  public getVariation({ experimentKey, attributes }: ExperimentationParamInterface) {
    const userId = this.userService?.user?.id;
    return this.optimizelyClientInstance?.getVariation(experimentKey, userId, attributes);
  }

  public isFeatureEnabled({ featureKey, attributes }: FeatureParamInterface) {
    const userId = this.userService?.user?.id;
    return this.optimizelyClientInstance?.isFeatureEnabled(featureKey, userId, attributes);
  }
}
