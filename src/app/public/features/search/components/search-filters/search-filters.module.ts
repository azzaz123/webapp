import { NgModule } from '@angular/core';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';
import { DrawerModule } from '@public/shared/components/drawer/drawer.module';
import { SearchFiltersComponent } from './search-filters.component';

@NgModule({
  imports: [DrawerModule, BubbleModule],
  providers: [],
  declarations: [SearchFiltersComponent],
  exports: [SearchFiltersComponent],
})
export class SearchFiltersModule {}
