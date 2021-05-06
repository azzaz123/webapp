import { NgModule } from '@angular/core';
import { ViewportService } from '@core/viewport/viewport.service';
import { CheckSessionModule } from '@public/core/directives/check-session/check-session.module';
import { ItemFavouritesModule } from '@public/core/services/item-favourites/item-favourites.module';
import { PublicLayoutModule } from '@public/layout/public-layout.module';
import { ItemCardListModule } from '@public/shared/components/item-card-list/item-card-list.module';
import { AdSlotShoppingModule } from '@shared/ads/ad-slot-shopping/ad-slot-shopping.module';
import { ErrorBoxModule } from '@shared/error-box/error-box.module';
import { SharedModule } from '@shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FiltersWrapperModule } from './components/filters-wrapper/filters-wrapper.module';
import { SearchErrorLayoutComponent } from './components/search-error-layout/search-error-layout.component';
import { SearchLayoutComponent } from './components/search-layout/search-layout.component';
import { SortFilterModule } from './components/sort-filter/sort-filter.module';
import { SearchAPIService } from './core/services/infrastructure/api/search-api.service';
import { SearchFavouritesService } from './core/services/infrastructure/favorites/search-favourites.service';
import { SearchInfrastructureService } from './core/services/infrastructure/search-infrastructure.service';
import { SearchService } from './core/services/search.service';
import { SearchComponent } from './pages/search.component';
import { SearchRoutingModule } from './search.routing.module';
import {
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FILTER_PARAMETER_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { SearchStoreService } from '@public/features/search/core/services/search-store.service';
import { SearchResolver } from './core/services/search.resolver';
import { SearchAdsService } from './core/ads/search-ads.service';
import { SearchQueryStringService } from '@public/features/search/core/services/search-query-string.service';
import { QueryStringLocationService } from '@public/features/search/core/services/query-string-location.service';

@NgModule({
  imports: [
    SharedModule,
    SearchRoutingModule,
    PublicLayoutModule,
    ItemCardListModule,
    CheckSessionModule,
    FiltersWrapperModule,
    AdSlotShoppingModule,
    ItemFavouritesModule,
    ErrorBoxModule,
    InfiniteScrollModule,
    SortFilterModule,
  ],
  providers: [
    ViewportService,
    SearchService,
    SearchInfrastructureService,
    SearchAPIService,
    SearchFavouritesService,
    SearchStoreService,
    {
      provide: FILTER_PARAMETER_STORE_TOKEN,
      useClass: FilterParameterStoreService,
    },
    {
      provide: FILTER_PARAMETER_DRAFT_STORE_TOKEN,
      useClass: FilterParameterStoreService,
    },
    SearchResolver,
    SearchAdsService,
    SearchQueryStringService,
    QueryStringLocationService,
  ],
  declarations: [SearchComponent, SearchLayoutComponent, SearchErrorLayoutComponent],
})
export class SearchModule {}
