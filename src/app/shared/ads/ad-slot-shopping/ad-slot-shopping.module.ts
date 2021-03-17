import { NgModule } from '@angular/core';
import { AdSlotShoppingComponent } from './native/ad-slot-shopping.component';
import {AdSlotGroupShoppingComponent} from './group/ad-slot-group-shopping.component';

@NgModule({
  declarations: [AdSlotShoppingComponent, AdSlotGroupShoppingComponent],
  exports: [AdSlotShoppingComponent, AdSlotGroupShoppingComponent],
})
export class AdSlotShoppingModule {}
