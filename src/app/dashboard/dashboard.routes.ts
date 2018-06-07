import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from '../core/user/logged.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: 'pro',
    canActivate: [LoggedGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: PERMISSIONS.professional,
            redirectTo: '/catalog/list'
          }
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {
}

export const dashboardRoutedComponents = [DashboardComponent];
