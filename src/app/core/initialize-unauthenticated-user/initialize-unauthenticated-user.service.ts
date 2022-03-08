import { Injectable } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ExperimentationService } from '@core/experimentation/services/experimentation/experimentation.service';
import { ExternalCommsService } from '@core/external-comms.service';
import { PermissionsInitializerService } from '@core/permissions/permissions.service';
import { INIT_FEATURE_FLAGS } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InitializeUnauthenticatedUserService {
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

  public async initialize(): Promise<void> {
    this.permissionsService.setDefaultPermissions();
    this.featureFlagsService.getFlags(INIT_FEATURE_FLAGS);

    await this.analyticsService.initializeAnalyticsWithUnauthenticatedUser();

    this.experimentationService.initializeExperimentationWithUnauthenticatedUser();
    this.externalCommsService.initializeBraze();

    this._isInitializationComplete$.complete();
  }
}
