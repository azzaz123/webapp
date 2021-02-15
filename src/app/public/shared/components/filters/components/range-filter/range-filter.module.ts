import { NgModule } from '@angular/core';
import { SliderFormModule } from '@shared/form/components/slider/slider-form.module';
import { RangeFilterComponent } from './range-filter.component';

@NgModule({
  declarations: [RangeFilterComponent],
  imports: [SliderFormModule],
  exports: [RangeFilterComponent],
})
export class RangeFilterModule {}
