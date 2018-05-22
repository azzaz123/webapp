import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallsComponent } from './calls.component';
import { LoggedGuard } from '../core/user/logged.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';

const routes: Routes = [
  {
    path: 'pro',
    canActivate: [LoggedGuard],
    children: [
      {
        path: 'calls',
        component: CallsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: PERMISSIONS.professional,
            redirectTo: '/catalog/list'
          },
          isMyZone: true
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallsRoutingModule {
}

export const callsRoutedComponents = [CallsComponent];
