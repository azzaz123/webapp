import { NgModule } from '@angular/core';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { DrawerModule } from '@public/shared/components/drawer/drawer.module';
import { FilterGroupModule } from '@public/shared/components/filters/components/filter-group/filter-group.module';
import { SearchFiltersComponent } from './search-filters.component';

@NgModule({
  imports: [DrawerModule, BubbleModule, FilterGroupModule],
  providers: [],
  declarations: [SearchFiltersComponent],
  exports: [SearchFiltersComponent],
})
export class SearchFiltersModule {}
