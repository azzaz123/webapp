import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileResolver } from '@data/user';
import { ItemDetailComponent } from './pages/item-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ItemDetailComponent,
    resolve: {
      profile: ProfileResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemDetailRoutingModule {}

export const itemDetailRoutedComponents = [ItemDetailComponent];
