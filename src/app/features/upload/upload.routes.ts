import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { ExitConfirmGuard } from '@shared/guards/exit-confirm.guard';

import { NgxPermissionsGuard } from 'ngx-permissions';
import { EditComponent } from './components/edit/edit.component';
import { ItemResolverService } from './core/resolvers/item-resolver.service';
import { UploadComponent } from './pages/upload.component';

const routes: Routes = [
  {
    path: '',
    component: UploadComponent,
  },
  {
    path: ':id',
    component: EditComponent,
    canActivate: [NgxPermissionsGuard],
    canDeactivate: [ExitConfirmGuard],
    resolve: {
      item: ItemResolverService,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadRoutingModule {}

export const uploadRoutedComponents = [UploadComponent, EditComponent];
