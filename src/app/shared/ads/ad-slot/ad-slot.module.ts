import { NgModule } from '@angular/core';
import { AdSlotComponent } from './ad-slot.component';
import { AdSlotWrapperComponent } from './ad-slot-wrapper/ad-slot-wrapper.component';

@NgModule({
  declarations: [AdSlotComponent, AdSlotWrapperComponent],
  exports: [AdSlotComponent, AdSlotWrapperComponent],
})
export class AdSlotModule {}
