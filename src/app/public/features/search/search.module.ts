import { NgModule } from '@angular/core';
import { ViewportService } from '@core/viewport/viewport.service';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { PublicLayoutModule } from '@public/layout/public-layout.module';
import { AdModule } from '@shared/ad/ad.module';
import { SharedModule } from '@shared/shared.module';
import { ItemCardListModule } from '../public-profile/pages/user-published/components/item-card-list/item-card-list.module';
import { SearchFiltersModule } from './components/search-filters/search-filters.module';
import { SearchLayoutComponent } from './components/search-layout/search-layout.component';
import { SearchComponent } from './pages/search.component';
import { SearchRoutingModule } from './search.routing.module';

@NgModule({
  imports: [SharedModule, SearchRoutingModule, PublicLayoutModule, ItemCardListModule, CheckSessionModule, AdModule, SearchFiltersModule],
  providers: [ViewportService],
  declarations: [SearchComponent, SearchLayoutComponent],
})
export class SearchModule {}
