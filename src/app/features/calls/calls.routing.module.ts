import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PERMISSIONS } from '@core/user/user';

import { NgxPermissionsGuard } from 'ngx-permissions';
import { CallsComponent } from './pages/calls.component';

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
