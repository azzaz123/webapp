import { NgModule } from '@angular/core';
import { SideSkyModule } from './side-sky/side-sky.module';
import { TopSkyModule } from './top-sky/top-sky.module';

@NgModule({
  imports: [TopSkyModule, SideSkyModule],
  exports: [TopSkyModule, SideSkyModule],
})
export class SkiesModule {}
