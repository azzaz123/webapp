import { NgModule } from '@angular/core';
import { BottomNavigationBarModule } from '@layout/bottom-navigation-bar/bottom-navigation-bar.module';
import { ToastModule } from '@layout/toast/toast.module';
import { TopbarModule } from '@layout/topbar/topbar.module';
import { FooterModule } from '@public/layout/components/footer/footer.module';

@NgModule({
  exports: [TopbarModule, BottomNavigationBarModule, FooterModule, ToastModule],
})
export class PublicLayoutModule {}
