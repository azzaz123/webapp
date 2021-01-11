import { NgModule } from '@angular/core';
import { SideAdModule } from './side-ad/side-ad.module';
import { TopAdModule } from './top-ad/top-ad.module';

@NgModule({
  imports: [TopAdModule, SideAdModule],
  exports: [TopAdModule, SideAdModule],
})
export class AdsModule {}
