import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemSpecificationsComponent } from './item-specifications.component';
import { CounterSpecificationModule } from '@public/shared/components/counter-specification/counter-specification.module';

@NgModule({
  declarations: [ItemSpecificationsComponent],
  imports: [CommonModule, CounterSpecificationModule],
  exports: [ItemSpecificationsComponent],
})
export class ItemSpecificationsModule {}
