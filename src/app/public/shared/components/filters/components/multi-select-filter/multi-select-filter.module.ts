import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOptionServiceModule } from '@public/shared/services/filter-option/filter-option-service.module';
import { MultiSelectFilterComponent } from './multi-select-filter.component';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { AbstractSelectFilterModule } from '../abstract-select-filter/abstract-select-filter.module';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiSelectFormModule } from '@shared/form/components/multi-select-form/multi-select-form.module';
import { ScrollModule } from '@shared/scroll/scroll.module';

@NgModule({
  declarations: [MultiSelectFilterComponent],
  exports: [MultiSelectFilterComponent],
  imports: [
    CommonModule,
    FilterOptionServiceModule,
    AbstractFilterModule,
    AbstractSelectFilterModule,
    SelectFormModule,
    ReactiveFormsModule,
    MultiSelectFormModule,
    ScrollModule,
  ],
})
export class MultiSelectFilterModule {}
