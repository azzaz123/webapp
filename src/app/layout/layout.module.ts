import { NgModule } from '@angular/core';
import { TopbarModule } from './topbar/topbar.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { TabbarModule } from './tabbar/tabbar.module';
import { ToastModule } from './toast/toast.module';
import { MobileBlockerModule } from './mobile-blocker/mobile-blocker.module';

@NgModule({
  exports: [
    SidebarModule,
    TopbarModule,
    TabbarModule,
    ToastModule,
    MobileBlockerModule,
  ],
})
export class LayoutModule {}
