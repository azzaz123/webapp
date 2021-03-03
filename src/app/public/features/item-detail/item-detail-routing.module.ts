import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdsResolver } from '@core/ads/resolvers/ads.resolver';
import { ItemDetailComponent } from './pages/item-detail.component';

const routes: Routes = [
  {
    path: '',
    resolve: {
      adsLoaded: AdsResolver,
    },
    component: ItemDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemDetailRoutingModule {}

export const itemDetailRoutedComponents = [ItemDetailComponent];
