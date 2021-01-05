import { NgModule } from '@angular/core';
import { FooterModule } from '@layout/footer/footer.module';
import { TabbarModule } from '@layout/tabbar/tabbar.module';
import { TopbarModule } from '@layout/topbar/topbar.module';

@NgModule({
  imports: [TopbarModule, TabbarModule, FooterModule],
  exports: [TopbarModule, TabbarModule, FooterModule],
})
export class PublicLayoutModule {}
