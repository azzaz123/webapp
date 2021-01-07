import { NgModule } from '@angular/core';
import { MobileBlockerModule } from '@layout/mobile-blocker/mobile-blocker.module';
import { SidebarModule } from '@layout/sidebar/sidebar.module';
import { TabbarModule } from '@layout/tabbar/tabbar.module';
import { ToastModule } from '@layout/toast/toast.module';
import { TopbarModule } from '@layout/topbar/topbar.module';

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
