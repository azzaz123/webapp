import { SharedModule } from '@shared/shared.module';
import { NgModule } from '@angular/core';
import { SearchComponent } from './pages/search.component';
import { SearchRoutingModule } from './search.routing.module';
import { SearchLayoutComponent } from './components/search-layout/search-layout.component';
import { PublicLayoutModule } from '@public/layout/public-layout.module';
import { ItemCardListModule } from '@public/features/public-profile/pages/user-published/components/item-card-list/item-card-list.module';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { ViewportService } from '@core/viewport/viewport.service';
import { SearchFiltersModule } from './components/search-filters/search-filters.module';

@NgModule({
  imports: [SharedModule, SearchRoutingModule, PublicLayoutModule, ItemCardListModule, CheckSessionModule, SearchFiltersModule],
  providers: [ViewportService],
  declarations: [SearchComponent, SearchLayoutComponent],
})
export class SearchModule {}
