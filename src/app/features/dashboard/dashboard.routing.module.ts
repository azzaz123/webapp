import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PERMISSIONS } from '@core/user/user';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { DashboardComponent } from './pages/dashboard.component';

const routes: Routes = [
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
