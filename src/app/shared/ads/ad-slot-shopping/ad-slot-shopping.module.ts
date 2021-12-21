import { NgModule } from '@angular/core';
import { AdSlotShoppingComponent } from './card/ad-slot-shopping.component';
import { AdSlotGroupShoppingComponent } from './group/ad-slot-group-shopping.component';
import { AdSlotShoppingDirective } from './card/ad-slot-shopping.directive';
import { AdSlotGroupShoppingDirective } from './group/ad-slot-group-shopping.directive';

@NgModule({
  declarations: [AdSlotShoppingComponent, AdSlotGroupShoppingComponent, AdSlotShoppingDirective, AdSlotGroupShoppingDirective],
  exports: [AdSlotShoppingComponent, AdSlotGroupShoppingComponent, AdSlotShoppingDirective, AdSlotGroupShoppingDirective],
})
export class AdSlotShoppingModule {}
