import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedGuard } from './user/logged.guard';
import { CookieModule } from 'ngx-cookie';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { ItemModule } from './item/item.module';
import { TrackingModule } from './tracking/tracking.module';

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
  ],
  declarations: []
})
export class CoreModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        LoggedGuard,
        UserService
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
