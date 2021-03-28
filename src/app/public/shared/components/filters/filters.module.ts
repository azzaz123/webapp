import { NgModule } from '@angular/core';
import { RangeFilterModule } from './components/range-filter/range-filter.module';
import { ToggleFilterModule } from './components/toggle-filter/toggle-filter.module';
import { SelectorFilterModule } from './components/selector-filter/selector-filter.module';

@NgModule({
  imports: [ToggleFilterModule, RangeFilterModule, SelectorFilterModule],
})
export class FiltersModule {}
