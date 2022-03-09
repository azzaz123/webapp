import { Injectable } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CallsService } from '@core/conversation/calls.service';
import { EventService } from '@core/event/event.service';
import { ExperimentationService } from '@core/experimentation/services/experimentation/experimentation.service';
import { ExternalCommsService } from '@core/external-comms.service';
import { AccessTokenService } from '@core/http/access-token.service';
import { RealTimeService } from '@core/message/real-time.service';
import { PermissionsInitializerService } from '@core/permissions-initializer/permissions-initializer.service';
import { INIT_FEATURE_FLAGS } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { User } from '@core/user/user';
import { UserService } from '@core/user/user.service';
import { InboxService } from '@private/features/chat/core/inbox/inbox.service';

@Injectable({ providedIn: 'root' })
export class InitializeAuthenticatedUserService {
  constructor(
    private userService: UserService,
    private permissionsService: PermissionsInitializerService,
    private analyticsService: AnalyticsService,
    private featureFlagsService: FeatureFlagService,
    private externalCommsService: ExternalCommsService,
    private experimentationService: ExperimentationService,
    private event: EventService,
    private inboxService: InboxService,
    private realTime: RealTimeService,
    private callService: CallsService,
    private accessTokenService: AccessTokenService
  ) {}

  public async initialize(): Promise<void> {
    this.permissionsService.setDefaultPermissions();

    const user = await this.userService.initializeUser();
    this.permissionsService.setUserPermissions(user);
    this.featureFlagsService.getFlags(INIT_FEATURE_FLAGS);
    this.initRealTimeChat(user, this.accessTokenService.accessToken);

    await this.analyticsService.initializeAnalyticsWithAuthenticatedUser(user);
    this.experimentationService.initializeExperimentationWithAuthenticatedUser();
    this.externalCommsService.initializeBraze();
  }

  private initRealTimeChat(user: User, accessToken: string): void {
    this.event.subscribe(EventService.CHAT_RT_CONNECTED, () => {
      this.initCalls();
      this.inboxService.init();
    });
    this.realTime.connect(user.id, accessToken);
  }

  private initCalls(): void {
    this.userService.isProfessional().subscribe((isProfessional: boolean) => {
      if (isProfessional) {
        this.callService.init().subscribe(() => this.callService.init(true).subscribe());
      }
    });
  }
}
