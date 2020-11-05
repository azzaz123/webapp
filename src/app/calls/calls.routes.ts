import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CallsComponent } from './calls.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';

const routes: Routes = [
  {
    path: '',
    component: CallsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: PERMISSIONS.professional,
        redirectTo: '/catalog/list',
      },
      isMyZone: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallsRoutingModule {}

export const callsRoutedComponents = [CallsComponent];
