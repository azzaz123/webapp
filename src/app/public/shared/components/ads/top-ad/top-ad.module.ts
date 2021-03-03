import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdModule } from '@shared/ad/ad.module';
import { TopSkyComponent } from './top-sky.component';

@NgModule({
  declarations: [TopSkyComponent],
  imports: [CommonModule, AdModule],
  exports: [TopSkyComponent],
})
export class TopAdModule {}
