import { NgModule } from '@angular/core';
import { TopbarModule } from './topbar/topbar.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { TabbarModule } from './tabbar/tabbar.module';
import { ToastModule } from './toast/toast.module';

@NgModule({
  imports: [SidebarModule, TopbarModule, ToastModule, TabbarModule],
  exports: [SidebarModule, TopbarModule, TabbarModule, ToastModule],
})
export class LayoutModule {}
