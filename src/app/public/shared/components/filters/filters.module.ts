import { NgModule } from '@angular/core';
import { RangeFilterModule } from './components/range-filter/range-filter.module';
import { ToggleFilterModule } from './components/toggle-filter/toggle-filter.module';
import { SelectFilterModule } from './components/select-filter/select-filter.module';
import { IconGridFilterModule } from './components/icon-grid-filter/icon-grid-filter.module';
import { SuggesterFilterModule } from './components/suggester-filter/suggester-filter.module';

@NgModule({
  imports: [ToggleFilterModule, RangeFilterModule, SelectFilterModule, SuggesterFilterModule, IconGridFilterModule],
})
export class FiltersModule {}
