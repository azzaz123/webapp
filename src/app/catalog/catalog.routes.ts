import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { LoggedGuard } from '../core/user/logged.guard';
import { CatalogComponent } from './catalog.component';
import { UploadCarComponent } from './upload/upload-car/upload-car.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: 'catalog',
    component: CatalogComponent,
    canActivate: [LoggedGuard],
    children: [
      {
        path: 'list',
        component: ListComponent
      },
      {
        path: 'upload/100',
        component: UploadCarComponent
      },
      {
        path: 'upload/:catId',
        component: UploadComponent
      },
      {
        path: 'upload',
        component: UploadComponent
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
  ListComponent,
  UploadComponent,
  UploadCarComponent
];
