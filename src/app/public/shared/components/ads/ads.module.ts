import { NgModule } from '@angular/core';
import { SideAdModule } from './side-sky/side-ad.module';
import { TopAdModule } from './top-sky/top-ad.module';

@NgModule({
  imports: [TopAdModule, SideAdModule],
  exports: [TopAdModule, SideAdModule],
})
export class AdsModule {}
