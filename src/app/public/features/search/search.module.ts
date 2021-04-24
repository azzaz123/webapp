import { NgModule } from '@angular/core';
import { ViewportService } from '@core/viewport/viewport.service';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { ItemFavouritesModule } from '@public/core/services/item-favourites/item-favourites.module';
import { PublicLayoutModule } from '@public/layout/public-layout.module';
import { ItemCardListModule } from '@public/shared/components/item-card-list/item-card-list.module';
import { AdSlotShoppingModule } from '@shared/ads/ad-slot-shopping/ad-slot-shopping.module';
import { AdSlotModule } from '@shared/ads/ad-slot/ad-slot.module';
import { SharedModule } from '@shared/shared.module';
import { FiltersWrapperModule } from './components/filters-wrapper/filters-wrapper.module';
import { SearchLayoutComponent } from './components/search-layout/search-layout.component';
import { SearchAPIService } from './core/services/infrastructure/api/search-api.service';
import { SearchFavouritesService } from './core/services/infrastructure/favorites/search-favourites.service';
import { SearchInfrastructureService } from './core/services/infrastructure/search-infrastructure.service';
import { SearchStoreService } from './core/services/search-store.service';
import { SearchService } from './core/services/search.service';
import { SearchComponent } from './pages/search.component';
import { SearchRoutingModule } from './search.routing.module';

@NgModule({
  imports: [
    SharedModule,
    SearchRoutingModule,
    PublicLayoutModule,
    ItemCardListModule,
    CheckSessionModule,
    FiltersWrapperModule,
    AdSlotModule,
    AdSlotShoppingModule,
    ItemFavouritesModule,
    ErrorBoxModule
  ],
  providers: [ViewportService, SearchStoreService, SearchService, SearchInfrastructureService, SearchAPIService, SearchFavouritesService],
  declarations: [SearchComponent, SearchLayoutComponent],
})
export class SearchModule {}
