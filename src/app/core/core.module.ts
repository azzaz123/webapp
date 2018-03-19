import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedGuard } from './user/logged.guard';
import { CookieModule } from 'ngx-cookie';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { EventService } from './event/event.service';
import { TrackingService } from './tracking/tracking.service';
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
import { NotificationService } from './notification/notification.service';
import { PaymentService } from './payments/payment.service';
import { PersistencyService } from './persistency/persistency.service';
import { WindowRef } from './window/window.service';
import { XmppService } from './xmpp/xmpp.service';
import { PushNotificationsModule } from 'ng-push';
import { ToastrModule } from 'ngx-toastr';
import { ReviewService } from './review/review.service';

@NgModule({
  imports: [
    CommonModule,
    CookieModule.forChild(),
    ToastrModule.forRoot(),
    CommonModule,
    UserModule,
    ItemModule,
    TrackingModule,
    ConversationModule,
    PushNotificationsModule
  ],
  exports: [
    CommonModule,
    UserModule,
    ItemModule,
    TrackingModule
  ],
  providers: [AdService]
})
export class CoreModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        LoggedGuard,
        EventService,
        TrackingService,
        I18nService,
        ErrorsService,
        TutorialService,
        AccessTokenService,
        HttpService,
        DebugService,
        MessageService,
        NotificationService,
        PaymentService,
        PersistencyService,
        WindowRef,
        XmppService,
        ReviewService
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
