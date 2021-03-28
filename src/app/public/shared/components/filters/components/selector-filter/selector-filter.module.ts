import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOptionServiceModule } from '@public/shared/services/filter-option/filter-option-service.module';
import { SelectorFilterComponent } from './selector-filter.component';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { AbstractSelectorFilterModule } from '../abstract-selector-filter/abstract-selector-filter.module';
import { SelectorOptionModule } from '@public/shared/components/filters/components/abstract-selector-filter/selector-option/selector-option.module';

@NgModule({
  declarations: [SelectorFilterComponent],
  exports: [SelectorFilterComponent],
  imports: [CommonModule, FilterOptionServiceModule, AbstractFilterModule, AbstractSelectorFilterModule, SelectorOptionModule],
})
export class SelectorFilterModule {}
