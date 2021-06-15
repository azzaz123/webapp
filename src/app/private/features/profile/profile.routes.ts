import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoggedGuard } from '@core/user/logged.guard';
import { PERMISSIONS } from '@core/user/user-constants';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AccountComponent } from './pages/account/account.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { ProfileInfoComponent } from './pages/profile-info/profile-info.component';
import { ProfileProSubscriptionComponent } from './pages/profile-pro-subscription/profile-pro-subscription.component';
import { ProfileComponent } from './pages/profile.component';
import { SubscriptionsComponent } from './pages/subscription/subscription.component';

const routes: Route[] = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
    canDeactivate: [ExitConfirmGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      isMyZone: true,
      isProfile: true,
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'info' },
      {
        path: 'info',
        component: ProfileInfoComponent,
        canDeactivate: [ExitConfirmGuard],
        data: {
          isMyZone: true,
          isProfile: true,
        },
      },
      {
        path: 'account',
        component: AccountComponent,
        canDeactivate: [ExitConfirmGuard],
        data: {
          isMyZone: true,
          isProfile: true,
        },
      },
      {
        path: 'subscriptions',
        component: SubscriptionsComponent,
        data: {
          isMyZone: true,
          isProfile: true,
          permissions: {
            except: PERMISSIONS.professional,
            redirectTo: '/profile',
          },
        },
      },
      {
        path: 'billing',
        component: InvoiceComponent,
        canDeactivate: [ExitConfirmGuard],
        data: {
          isMyZone: true,
          isProfile: true,
        },
      },
      {
        path: 'subscription-pro',
        component: ProfileProSubscriptionComponent,
        data: {
          isMyZone: true,
          isProfile: true,
          permissions: {
            only: PERMISSIONS.professional,
            redirectTo: '/profile',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}

export const profileRoutedComponents = [
  ProfileComponent,
  ProfileInfoComponent,
  AccountComponent,
  SubscriptionsComponent,
  ProfileProSubscriptionComponent,
  InvoiceComponent,
];
