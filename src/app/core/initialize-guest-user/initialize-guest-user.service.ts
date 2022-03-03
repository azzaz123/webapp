import { Injectable } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ExperimentationService } from '@core/experimentation/services/experimentation/experimentation.service';
import { ExternalCommsService } from '@core/external-comms.service';
import { PermissionsInitializerService } from '@core/permissions/permissions.service';
import { INIT_FEATURE_FLAGS } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { forkJoin, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class InitializeGuestUserService {
  private readonly _isInitializationComplete$: ReplaySubject<void> = new ReplaySubject<void>();

  constructor(
    private permissionsService: PermissionsInitializerService,
    private analyticsService: AnalyticsService,
    private featureFlagsService: FeatureFlagService,
    private externalCommsService: ExternalCommsService,
    private experimentationService: ExperimentationService
  ) {}

  public get isInitializationComplete(): Promise<void> {
    return this._isInitializationComplete$.toPromise();
  }

  public initialize(): void {
    this.analyticsService.mParticleReady$.pipe(take(1)).subscribe(() => {
      this.experimentationService.initializeExperimentationWithGuestUser();
      this.externalCommsService.initializeBraze();
    });
    forkJoin([this.experimentationService.experimentReady$, this.externalCommsService.brazeReady$]).subscribe(() => {
      this._isInitializationComplete$.next();
      this._isInitializationComplete$.complete();
    });

    this.permissionsService.setDefaultPermissions();
    this.analyticsService.initializeAnalyticsWithGuestUser();
    this.featureFlagsService.getFlags(INIT_FEATURE_FLAGS);
  }
}
