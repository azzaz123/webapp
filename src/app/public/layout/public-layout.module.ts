import { NgModule } from '@angular/core';
import { TabbarModule } from '@layout/tabbar/tabbar.module';
import { TopbarModule } from '@layout/topbar/topbar.module';
import { FooterModule } from '@public/layout/components/footer/footer.module';

@NgModule({
  exports: [TopbarModule, TabbarModule, FooterModule],
})
export class PublicLayoutModule {}
