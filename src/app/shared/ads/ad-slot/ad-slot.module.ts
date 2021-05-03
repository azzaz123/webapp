import { NgModule } from '@angular/core';
import { AdNativeSlotComponent } from './ad-native-slot/ad-native-slot.component';
import { AdSlotComponent } from './ad-slot.component';

@NgModule({
  declarations: [AdSlotComponent, AdNativeSlotComponent],
  exports: [AdSlotComponent, AdNativeSlotComponent],
})
export class AdSlotModule {}
