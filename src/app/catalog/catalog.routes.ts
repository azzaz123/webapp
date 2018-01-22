import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { LoggedGuard } from '../core/user/logged.guard';
import { CatalogComponent } from './catalog.component';
import { UploadCarComponent } from './upload/upload-car/upload-car.component';
import { UploadComponent } from './upload/upload.component';
import { EditComponent } from './edit/edit.component';
import { ItemResolverService } from './item-resolver.service';
import { ExitConfirmGuard } from '../shared/guards/exit-confirm.guard';

const routes: Routes = [
  {
    path: 'catalog',
    component: CatalogComponent,
    canActivate: [LoggedGuard],
    children: [
      {
        path: 'list',
        component: ListComponent,
        data: {
          isMyZone: true
        }
      },
      {
        path: 'upload',
        component: UploadComponent
      },
      {
        path: 'edit/:id',
        component: EditComponent,
        canDeactivate: [ExitConfirmGuard],
        resolve: {
          item: ItemResolverService
        }
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
  UploadCarComponent,
  EditComponent
];
