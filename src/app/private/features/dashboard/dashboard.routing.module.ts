import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PERMISSIONS } from '@core/user/user-constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { DashboardComponent } from './pages/dashboard.component';

const routes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: PERMISSIONS.professional,
        redirectTo: '/catalog/list',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}

export const dashboardRoutedComponents = [DashboardComponent];
