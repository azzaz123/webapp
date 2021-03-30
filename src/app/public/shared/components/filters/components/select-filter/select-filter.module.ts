import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOptionServiceModule } from '@public/shared/services/filter-option/filter-option-service.module';
import { SelectFilterComponent } from './select-filter.component';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { AbstractSelectFilterModule } from '../abstract-select-filter/abstract-select-filter.module';
import { SelectOptionModule } from '@public/shared/components/filters/components/abstract-select-filter/select-option/select-option.module';

@NgModule({
  declarations: [SelectFilterComponent],
  exports: [SelectFilterComponent],
  imports: [CommonModule, FilterOptionServiceModule, AbstractFilterModule, AbstractSelectFilterModule, SelectOptionModule],
})
export class SelectFilterModule {}
