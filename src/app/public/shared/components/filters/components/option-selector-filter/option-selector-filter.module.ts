import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOptionServiceModule } from '@public/shared/services/filter-option/filter-option-service.module';
import { OptionSelectorFilterComponent } from './option-selector-filter.component';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { AbstractSelectorFilterModule } from '../abstract-selector-filter/abstract-selector-filter.module';
import { SelectorOptionModule } from '@public/shared/components/filters/components/abstract-selector-filter/selector-option/selector-option.module';

@NgModule({
  declarations: [OptionSelectorFilterComponent],
  exports: [OptionSelectorFilterComponent],
  imports: [CommonModule, FilterOptionServiceModule, AbstractFilterModule, AbstractSelectorFilterModule, SelectorOptionModule],
})
export class OptionSelectorFilterModule {}
