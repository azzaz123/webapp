import { NgModule } from '@angular/core';
import { RangeFilterModule } from './components/range-filter/range-filter.module';
import { ToggleFilterModule } from './components/toggle-filter/toggle-filter.module';
import { SelectFilterModule } from './components/select-filter/select-filter.module';
import { GridSelectFilterModule } from './components/grid-select-filter/grid-select-filter.module';
import { SuggesterFilterModule } from './components/suggester-filter/suggester-filter.module';
import { CategoriesFilterModule } from './components/categories-filter/categories-filter.module';
import { LocationFilterModule } from './components/location-filter/location-filter.module';
import { MultiSelectFilterModule } from './components/multi-select-filter/multi-select-filter.module';

@NgModule({
  imports: [
    ToggleFilterModule,
    RangeFilterModule,
    SelectFilterModule,
    SuggesterFilterModule,
    GridSelectFilterModule,
    CategoriesFilterModule,
    LocationFilterModule,
    MultiSelectFilterModule,
  ],
})
export class FiltersModule {}
