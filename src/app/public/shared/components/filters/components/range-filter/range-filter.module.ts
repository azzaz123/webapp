import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SliderFormModule } from '@shared/form/components/slider/slider-form.module';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { RangeFilterComponent } from './range-filter.component';

@NgModule({
  declarations: [RangeFilterComponent],
  imports: [CommonModule, AbstractFilterModule, SliderFormModule, ReactiveFormsModule],
  exports: [RangeFilterComponent],
})
export class RangeFilterModule {}
