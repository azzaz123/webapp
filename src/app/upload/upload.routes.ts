import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Route, RouterModule } from '@angular/router';
import { PERMISSIONS } from '../core/user/user';
import { UploadComponent } from './upload.component';
import { EditComponent } from './edit/edit.component';
import { ExitConfirmGuard } from '../shared/guards/exit-confirm.guard';
import { ItemResolverService } from './item-resolver.service';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Route[] = [
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
