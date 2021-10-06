import { NgModule } from '@angular/core';
import { AdSlotShoppingComponent } from './card/ad-slot-shopping.component';
import { AdSlotGroupShoppingComponent } from './group/ad-slot-group-shopping.component';
import { AdSlotShoppingDirective } from './card/ad-slot-shopping.directive';

@NgModule({
  declarations: [AdSlotShoppingComponent, AdSlotGroupShoppingComponent, AdSlotShoppingDirective],
  exports: [AdSlotShoppingComponent, AdSlotGroupShoppingComponent, AdSlotShoppingDirective],
})
export class AdSlotShoppingModule {}
