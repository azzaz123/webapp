import { CookieModule } from 'ngx-cookie';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionService } from '@core/session/session.service';
import { LoggedGuard } from './user/logged.guard';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { EventService } from './event/event.service';
import { TrackingModule } from './tracking/tracking.module';
import { I18nService } from './i18n/i18n.service';
import { ErrorsService } from './errors/errors.service';
import { TutorialService } from './tutorial/tutorial.service';
import { AccessTokenService } from './http/access-token.service';
import { ConversationModule } from './conversation/conversation.module';
import { DesktopNotificationsService } from './desktop-notifications/desktop-notifications.service';
import { PaymentService } from './payments/payment.service';
import { XmppService } from './xmpp/xmpp.service';
import { ReviewService } from './review/review.service';
import { ConnectionService } from './connection/connection.service';
import { RealTimeService } from './message/real-time.service';
import { ProfileModule } from './profile/profile.module';
import { ProfileService } from './profile/profile.service';
import {
  BlockUserService,
  BlockUserXmppService,
  InboxService,
  MessageService,
} from '../chat/service';
import { StripeService } from './stripe/stripe.service';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import { MobileBlockerModule } from './mobile-blocker/mobile-blocker.module';
import { DevelopmentGuard } from './user/development.guard';
import { DidomiService } from './didomi/didomi.service';
import { TrustAndSafetyService } from './trust-and-safety/trust-and-safety.service';

@NgModule({
  imports: [
    CookieModule.forChild(),
    CommonModule,
    UserModule,
    ItemModule,
    TrackingModule,
    ConversationModule.forRoot(),
    ProfileModule,
    MobileBlockerModule,
  ],
  exports: [
    CommonModule,
    UserModule,
    ItemModule,
    TrackingModule,
    ProfileModule,
    MobileBlockerModule,
  ],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        LoggedGuard,
        DevelopmentGuard,
        EventService,
        I18nService,
        ErrorsService,
        TutorialService,
        AccessTokenService,
        MessageService,
        DesktopNotificationsService,
        PaymentService,
        XmppService,
        RealTimeService,
        InboxService,
        BlockUserService,
        BlockUserXmppService,
        ReviewService,
        ConnectionService,
        ProfileService,
        StripeService,
        SubscriptionsService,
        DidomiService,
        TrustAndSafetyService,
        SessionService,
      ],
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
