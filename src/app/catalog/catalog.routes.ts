import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { LoggedGuard } from '../core/user/logged.guard';
import { CatalogComponent } from './catalog.component';

const routes: Routes = [
  {
    path: 'catalog',
    component: CatalogComponent,
    canActivate: [LoggedGuard],
    children: [
      {
        path: 'list',
        component: ListComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {
}

export const catalogRoutedComponents = [
  CatalogComponent,
  ListComponent
];
