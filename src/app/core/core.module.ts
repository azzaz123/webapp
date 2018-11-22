import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedGuard } from './user/logged.guard';
import { CookieModule } from 'ngx-cookie';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { EventService } from './event/event.service';
import { TrackingModule } from './tracking/tracking.module';
import { I18nService } from './i18n/i18n.service';
import { AdService } from './ad/ad.service';
import { ErrorsService } from './errors/errors.service';
import { TutorialService } from './tutorial/tutorial.service';
import { AccessTokenService } from './http/access-token.service';
import { HttpService } from './http/http.service';
import { ConversationModule } from './conversation/conversation.module';
import { DebugService } from './debug/debug.service';
import { MessageService } from './message/message.service';
import { MsgArchiveService } from './message/archive.service';
import { NotificationService } from './notification/notification.service';
import { PaymentService } from './payments/payment.service';
import { PersistencyService } from './persistency/persistency.service';
import { WindowRef } from './window/window.service';
import { XmppService } from './xmpp/xmpp.service';
import { PushNotificationsModule } from 'ng-push';
import { ReviewService } from './review/review.service';
import { PrivacyService } from './privacy/privacy.service';
import { ConnectionService } from './connection/connection.service';

@NgModule({
  imports: [
    CookieModule.forChild(),
    CommonModule,
    UserModule,
    ItemModule,
    TrackingModule,
    ConversationModule.forRoot(),
    PushNotificationsModule
  ],
  exports: [
    CommonModule,
    UserModule,
    ItemModule,
    TrackingModule
  ]
})
export class CoreModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        LoggedGuard,
        EventService,
        I18nService,
        ErrorsService,
        TutorialService,
        AccessTokenService,
        HttpService,
        DebugService,
        MessageService,
        MsgArchiveService,
        NotificationService,
        PaymentService,
        PersistencyService,
        WindowRef,
        XmppService,
        ReviewService,
        AdService,
        PrivacyService,
        ConnectionService
      ]
    };
  }

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

}
