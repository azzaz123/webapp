import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdsResolver } from '@core/ads/resolvers/ads.resolver';
import { ReusedRoute } from '@core/custom-route-reuse-strategy/interfaces/reused-route.interface';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { SearchComponent } from './pages/search.component';
import { SearchCategoriesResolver } from './resolvers/search-categories.resolver';

const SEARCH_ROUTE: ReusedRoute = {
  path: '',
  component: SearchComponent,
  resolve: {
    ads: AdsResolver,
    searchCategories: SearchCategoriesResolver,
  },
  data: {
    shouldReuseRoute: true,
    routeKey: PUBLIC_PATHS.SEARCH,
  },
};

const routes: Routes = [SEARCH_ROUTE];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
