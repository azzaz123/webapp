import { NgModule, Optional, SkipSelf } from '@angular/core';
import { UnreadChatMessagesService } from '@core/unread-chat-messages/unread-chat-messages.service';
import { CookieModule } from 'ngx-cookie';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { NgxPermissionsModule } from 'ngx-permissions';
import { EventService } from './event/event.service';
import { GeolocationService } from './geolocation/geolocation.service';
import { AccessTokenService } from './http/access-token.service';
import { I18nService } from './i18n/i18n.service';
import { PaymentService } from './payments/payment.service';
import { CoreStoreModule } from './store/core-store.module';
import { DevelopmentGuard } from './user/development.guard';
import { LoggedGuard } from './user/logged.guard';
import { SocialShareService } from './social-share/social-share.service';
import { AnalyticsService } from './analytics/analytics.service';
import { DeviceService } from './device/device.service';
import { DidomiService } from './ads/vendors/didomi/didomi.service';
import { LoadExternalLibsService } from './load-external-libs/load-external-libs.service';
import { FeatureflagService } from './user/featureflag.service';
import { SessionService } from './session/session.service';
import { UuidService } from './uuid/uuid.service';
import { HereMapsService } from '@shared/geolocation/here-maps/here-maps.service';
import { UserService } from './user/user.service';
import { ItemService } from './item/item.service';
import { AdsModule } from './ads/ads.module';
import { HAMMER_PROVIDER } from './hammerjs/hammerjs-provider';
import { HammerModule } from '@angular/platform-browser';
import { CategoryService } from './category/category.service';
import { ExternalCommsService } from './external-comms.service';
import { ReleaseVersionService } from './release-version/release-version.service';
import { SlugsUtilService } from './services/slugs-util/slugs-util.service';
import { MomentCalendarSpecService } from './i18n/moment/moment-calendar-spec.service';
import { ReportService } from './trust-and-safety/report/report.service';
import { SvgService } from './svg-icon/svg.service';

@NgModule({
  imports: [
    CookieModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    AdsModule,
    HammerModule,
    CoreStoreModule,
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
    HereMapsService,
    AnalyticsService,
    DeviceService,
    DidomiService,
    LoadExternalLibsService,
    SvgService,
    FeatureflagService,
    SessionService,
    UuidService,
    UserService,
    ItemService,
    HAMMER_PROVIDER,
    CategoryService,
    ReleaseVersionService,
    ExternalCommsService,
    SlugsUtilService,
    MomentCalendarSpecService,
    ReportService,
    /*   {
      provide: FILTER_PARAMETER_STORE_TOKEN,
      useClass: FilterParameterStoreService,
    },
    {
      provide: FILTER_PARAMETER_DRAFT_STORE_TOKEN,
      useClass: FilterParameterStoreService,
    }, */
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
