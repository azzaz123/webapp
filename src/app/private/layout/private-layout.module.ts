import { NgModule } from '@angular/core';
import { BottomNavigationBarModule } from '@layout/bottom-navigation-bar/bottom-navigation-bar.module';
import { ToastModule } from '@layout/toast/toast.module';
import { TopbarModule } from '@layout/topbar/topbar.module';
import { MobileBlockerModule } from '@private/layout/components/mobile-blocker/mobile-blocker.module';
import { SidebarModule } from '@private/layout/components/sidebar/sidebar.module';

@NgModule({
  exports: [SidebarModule, TopbarModule, BottomNavigationBarModule, ToastModule, MobileBlockerModule],
})
export class PrivateLayoutModule {}
