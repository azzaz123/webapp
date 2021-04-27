import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdsResolver } from '@core/ads/resolvers/ads.resolver';
import { SearchResolver } from './core/services/search.resolver';
import { SearchComponent } from './pages/search.component';

const routes: Routes = [
  {
    path: '',
    resolve: {
      ads: AdsResolver,
      search: SearchResolver,
    },
    component: SearchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
