import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedGuard } from '../core/user/logged.guard';
import { ProfileComponent } from './profile.component';
import { ExitConfirmGuard } from '../shared/guards/exit-confirm.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';
import { ProfileSubscriptionComponent } from './profile-subscription/profile-subscription.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
    canDeactivate: [ExitConfirmGuard],
    data: {
      isMyZone: true,
      isProfile: true,
      permissions: {
        only: PERMISSIONS.normal,
        redirectTo: '/pro/profile'
      }
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'info' },
      {
        path: 'info',
        component: ProfileInfoComponent,
        canDeactivate: [ExitConfirmGuard],
        data: {
          isMyZone: true,
          isProfile: true
        }
      },
      {
        path: 'subscription',
        component: ProfileSubscriptionComponent,
        data: {
          isMyZone: true,
          isProfile: true
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {
}

export const profileRoutedComponents = [
  ProfileComponent
];
