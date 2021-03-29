import { NgModule } from '@angular/core';
import { RangeFilterModule } from './components/range-filter/range-filter.module';
import { ToggleFilterModule } from './components/toggle-filter/toggle-filter.module';
import { OptionSelectorFilterModule } from './components/option-selector-filter/option-selector-filter.module';

@NgModule({
  imports: [ToggleFilterModule, RangeFilterModule, OptionSelectorFilterModule],
})
export class FiltersModule {}
