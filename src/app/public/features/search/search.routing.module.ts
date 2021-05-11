import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdsResolver } from '@core/ads/resolvers/ads.resolver';
import { ReusedRoute } from '@core/custom-route-reuse-strategy/interfaces/reused-route.interface';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { SearchResolver } from './core/services/search.resolver';
import { CanDeactivateSearchGuard } from './guards/can-deactivate-search.guard';
import { SearchComponent } from './pages/search.component';

const SEARCH_ROUTE: ReusedRoute = {
  path: '',
  component: SearchComponent,
  canDeactivate: [CanDeactivateSearchGuard],
  resolve: {
    ads: AdsResolver,
    search: SearchResolver,
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
