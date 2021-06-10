import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';
import { EditComponent } from './components/edit/edit.component';
import { ItemResolverService } from './core/resolvers/item-resolver.service';
import { UploadComponent } from './pages/upload.component';
import { UPLOAD_PATHS, UPLOAD_PATH_PARAMS } from './upload-routing-constants';

const routes: Route[] = [
  {
    path: '',
    component: UploadComponent,
  },
  {
    path: `:${UPLOAD_PATH_PARAMS.ID}`,
    component: EditComponent,
    canDeactivate: [ExitConfirmGuard],
    resolve: {
      item: ItemResolverService,
    },
  },
  {
    path: `:${UPLOAD_PATH_PARAMS.ID}/${UPLOAD_PATHS.REACTIVATE}`,
    component: EditComponent,
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
