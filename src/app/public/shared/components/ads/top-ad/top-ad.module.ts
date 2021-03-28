import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdSlotModule } from '@shared/ads/ad-slot/ad-slot.module';
import { TopSkyComponent } from './top-sky.component';

@NgModule({
  declarations: [TopSkyComponent],
  imports: [CommonModule, AdSlotModule],
  exports: [TopSkyComponent],
})
export class TopAdModule {}
