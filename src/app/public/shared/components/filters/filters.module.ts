import { NgModule } from '@angular/core';
import { RangeFilterModule } from './components/range-filter/range-filter.module';
import { ToggleFilterModule } from './components/toggle-filter/toggle-filter.module';
import { SelectFilterModule } from './components/select-filter/select-filter.module';
import { SuggesterFilterModule } from '@public/shared/components/filters/components/suggester-filter/suggester-filter.module';

@NgModule({
  imports: [ToggleFilterModule, RangeFilterModule, SelectFilterModule, SuggesterFilterModule],
})
export class FiltersModule {}
