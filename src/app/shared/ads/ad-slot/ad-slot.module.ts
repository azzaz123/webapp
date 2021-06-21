import { NgModule } from '@angular/core';
import { AdSlotComponent } from './ad-slot.component';
import { AdSlotGroupDirective } from './ad-slot-group.directive';

@NgModule({
  declarations: [AdSlotComponent, AdSlotGroupDirective],
  exports: [AdSlotComponent, AdSlotGroupDirective],
})
export class AdSlotModule {}
