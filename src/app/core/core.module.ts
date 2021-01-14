import { NgModule, Optional, SkipSelf } from '@angular/core';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { CookieModule } from 'ngx-cookie';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NgxPermissionsModule } from 'ngx-permissions';
import { EventService } from './event/event.service';
import { GeolocationService } from './geolocation/geolocation.service';
import { AccessTokenService } from './http/access-token.service';
import { I18nService } from './i18n/i18n.service';
import { ItemModule } from './item/item.module';
import { PaymentService } from './payments/payment.service';
import { TrackingModule } from './tracking/tracking.module';
import { DevelopmentGuard } from './user/development.guard';
import { LoggedGuard } from './user/logged.guard';
import { UserModule } from './user/user.module';
import { SocialShareService } from './social-share/social-share.service';

@NgModule({
  imports: [
    CookieModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    TrackingModule,
    DeviceDetectorModule.forRoot(),
    UserModule,
    ItemModule,
  ],
  providers: [
    LoggedGuard,
    DevelopmentGuard,
    EventService,
    I18nService,
    AccessTokenService,
    UnreadChatMessagesService,
    PaymentService,
    SocialShareService,
    GeolocationService,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
