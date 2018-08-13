import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileProComponent } from './profile-pro.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';
import { ProfileProInfoComponent } from './profile-pro-info/profile-pro-info.component';
import { ExitConfirmGuard } from '../shared/guards/exit-confirm.guard';
import { ProfileProBillingComponent } from './profile-pro-billing/profile-pro-billing.component';
import { ProfileProSubscriptionComponent } from './profile-pro-subscription/profile-pro-subscription.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileProComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: PERMISSIONS.professional,
        redirectTo: '/'
      }
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'info' },
      {
        path: 'info',
        component: ProfileProInfoComponent,
        canDeactivate: [ExitConfirmGuard],
        data: {
          isMyZone: true,
          isProfile: true
        }
      },
      {
        path: 'billing',
        component: ProfileProBillingComponent,
        canDeactivate: [ExitConfirmGuard],
        data: {
          isMyZone: true,
          isProfile: true
        }
      },
      {
        path: 'subscription',
        component: ProfileProSubscriptionComponent,
        data: {
          isMyZone: true,
          isProfile: true
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileProRoutingModule { }

export const profileProRoutedComponents = [
  ProfileProComponent,
  ProfileProInfoComponent,
  ProfileProBillingComponent,
  ProfileProSubscriptionComponent
];
