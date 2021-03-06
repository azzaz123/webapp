import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOptionServiceModule } from '@public/shared/services/filter-option/filter-option-service.module';
import { SelectFilterComponent } from './select-filter.component';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { AbstractSelectFilterModule } from '../abstract-select-filter/abstract-select-filter.module';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SelectFilterComponent],
  exports: [SelectFilterComponent],
  imports: [
    CommonModule,
    FilterOptionServiceModule,
    AbstractFilterModule,
    AbstractSelectFilterModule,
    SelectFormModule,
    ReactiveFormsModule,
  ],
})
export class SelectFilterModule {}
