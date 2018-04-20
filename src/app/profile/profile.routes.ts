import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedGuard } from '../core/user/logged.guard';
import { ProfileComponent } from './profile.component';
import { ExitConfirmGuard } from '../shared/guards/exit-confirm.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';
import { ProfileProInfoComponent } from './profile-pro/profile-pro-info/profile-pro-info.component';
import { ProfileProComponent } from './profile-pro/profile-pro.component';
import { ProfileProBillingComponent } from './profile-pro/profile-pro-billing/profile-pro-billing.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
    canDeactivate: [ExitConfirmGuard],
    data: {
      isMyZone: true,
      permissions: {
        only: PERMISSIONS.normal,
        redirectTo: '/pro/profile'
      }
    }
  },
  {
    path: 'pro',
    canActivate: [LoggedGuard],
    children: [
      {
        path: 'profile',
        component: ProfileProComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          isMyZone: true,
          permissions: {
            only: PERMISSIONS.professional,
            redirectTo: '/profile'
          }
        },
        children: [
          {
            path: 'info',
            component: ProfileProInfoComponent,
            canDeactivate: [ExitConfirmGuard]
          },
          {
            path: 'billing',
            component: ProfileProBillingComponent,
            canDeactivate: [ExitConfirmGuard]
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {
}

export const profileRoutedComponents = [
  ProfileComponent,
  ProfileProComponent,
  ProfileProInfoComponent,
  ProfileProBillingComponent
];
