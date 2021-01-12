import { CommonModule } from '@angular/common';
import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { HammerModule } from '@angular/platform-browser';
import { HAMMER_PROVIDER } from './hammerjs/hammerjs-provider';
import { BlockUserXmppService } from '@features/chat/core/block-user/block-user-xmpp.service';
import { BlockUserService } from '@features/chat/core/block-user/block-user.service';
import { InboxService } from '@features/chat/core/inbox/inbox.service';
import { MessageService } from '@features/chat/core/message/message.service';
import { CookieModule } from 'ngx-cookie';
import { CategoryService } from './category/category.service';
import { ConnectionService } from './connection/connection.service';
import { ConversationModule } from './conversation/conversation.module';
import { DesktopNotificationsService } from './desktop-notifications/desktop-notifications.service';
import { ErrorsService } from './errors/errors.service';
import { EventService } from './event/event.service';
import { GeolocationService } from './geolocation/geolocation.service';
import { AccessTokenService } from './http/access-token.service';
import { I18nService } from './i18n/i18n.service';
import { InvoiceService } from './invoice/invoice.service';
import { ItemModule } from './item/item.module';
import { RealTimeService } from './message/real-time.service';
import { PaymentService } from './payments/payment.service';
import { ProfileModule } from './profile/profile.module';
import { ProfileService } from './profile/profile.service';
import { ReviewService } from './review/review.service';
import { StripeService } from './stripe/stripe.service';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import { TrackingModule } from './tracking/tracking.module';
import { TrustAndSafetyService } from './trust-and-safety/trust-and-safety.service';
import { TutorialService } from './tutorial/tutorial.service';
import { DevelopmentGuard } from './user/development.guard';
import { LoggedGuard } from './user/logged.guard';
import { UserModule } from './user/user.module';
import { XmppService } from './xmpp/xmpp.service';

@NgModule({
  imports: [
    CookieModule.forRoot(),
    CommonModule,
    UserModule,
    ItemModule,
    TrackingModule,
    ConversationModule.forRoot(),
    ProfileModule,
    HammerModule,
  ],
  exports: [
    CommonModule,
    UserModule,
    ItemModule,
    TrackingModule,
    ProfileModule,
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
        TrustAndSafetyService,
        InvoiceService,
        GeolocationService,
        CategoryService,
        HAMMER_PROVIDER,
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
