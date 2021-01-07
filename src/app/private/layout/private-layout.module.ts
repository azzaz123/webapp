import { NgModule } from '@angular/core';
import { TabbarModule } from '@layout/tabbar/tabbar.module';
import { ToastModule } from '@layout/toast/toast.module';
import { TopbarModule } from '@layout/topbar/topbar.module';
import { MobileBlockerModule } from '@private/layout/components/mobile-blocker/mobile-blocker.module';
import { SidebarModule } from '@private/layout/components/sidebar/sidebar.module';

@NgModule({
  exports: [
    SidebarModule,
    TopbarModule,
    TabbarModule,
    ToastModule,
    MobileBlockerModule,
  ],
})
export class PrivateLayoutModule {}
