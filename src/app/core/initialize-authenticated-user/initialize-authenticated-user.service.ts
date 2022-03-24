import { Injectable } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { ExperimentationService } from '@core/experimentation/services/experimentation/experimentation.service';
import { ExternalCommsService } from '@core/external-comms.service';
import { PermissionsInitializerService } from '@core/permissions-initializer/permissions-initializer.service';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { INIT_FEATURE_FLAGS } from '@core/user/featureflag-constants';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { UserService } from '@core/user/user.service';

@Injectable({ providedIn: 'root' })
export class InitializeAuthenticatedUserService {
  constructor(
    private userService: UserService,
    private permissionsService: PermissionsInitializerService,
    private analyticsService: AnalyticsService,
    private featureFlagsService: FeatureFlagService,
    private externalCommsService: ExternalCommsService,
    private experimentationService: ExperimentationService,
    private unreadChatMessagesService: UnreadChatMessagesService
  ) {}

  public async initialize(): Promise<void> {
    this.permissionsService.setDefaultPermissions();
    this.unreadChatMessagesService.initializeUnreadChatMessages();

    const user = await this.userService.initializeUser();
    this.permissionsService.setUserPermissions(user);
    this.featureFlagsService.getFlags(INIT_FEATURE_FLAGS);

    await this.analyticsService.initializeAnalyticsWithAuthenticatedUser(user);

    this.experimentationService.initializeExperimentationWithAuthenticatedUser();
    this.externalCommsService.initializeBraze();
  }
}
