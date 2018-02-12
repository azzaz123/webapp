import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedGuard } from './user/logged.guard';
import { CookieModule } from 'ngx-cookie';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { ItemService } from './item/item.service';
import { ConversationService } from './conversation/conversation.service';
import { EventService } from './event/event.service';
import { TrackingService } from './tracking/tracking.service';
import { TrackingModule } from './tracking/tracking.module';
import { I18nService } from './i18n/i18n.service';
import { ErrorsService } from './errors/errors.service';
import { TutorialService } from './tutorial/tutorial.service';

@NgModule({
  imports: [
    CommonModule,
    CookieModule.forChild(),
    CommonModule,
    UserModule,
    ItemModule,
    TrackingModule
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
        UserService,
        ItemService,
        UserService,
        ConversationService,
        EventService,
        TrackingService,
        I18nService,
        ErrorsService,
        TutorialService
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
