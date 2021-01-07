import { NgModule } from '@angular/core';
import { TopbarModule } from './topbar/topbar.module';
import { TabbarModule } from './tabbar/tabbar.module';
import { ToastModule } from './toast/toast.module';

//TODO: This will be removed in next iterations as these modules are only used in the private layout
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
export class LayoutModule {}
