import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoggedGuard } from '../core/user/logged.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';
import { HelpComponent } from './help.component';

const routes: Routes = [
  {
    path: 'pro',
    canActivate: [LoggedGuard],
    children: [
      {
        path: 'help',
        component: HelpComponent,
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
export class HelpRoutingModule {
}

export const helpsRoutedComponents = [HelpComponent];
