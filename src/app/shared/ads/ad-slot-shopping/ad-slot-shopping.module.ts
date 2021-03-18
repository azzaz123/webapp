import { NgModule } from '@angular/core';
import { AdSlotNativeShoppingComponent } from './native/ad-slot-native-shopping.component';
import { AdSlotGroupShoppingComponent } from './group/ad-slot-group-shopping.component';

@NgModule({
  declarations: [AdSlotNativeShoppingComponent, AdSlotGroupShoppingComponent],
  exports: [AdSlotNativeShoppingComponent, AdSlotGroupShoppingComponent],
})
export class AdSlotShoppingModule {}
