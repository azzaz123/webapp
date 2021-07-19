import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LoggedGuard } from '@core/user/logged.guard';
import { PERMISSIONS } from '@core/user/user-constants';
import { ExitConfirmGuard } from '@core/guards/exit-confirm.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SubscriptionsComponent } from './pages/subscription/subscription.component';
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { ProfileProSubscriptionComponent } from './pages/profile-pro-subscription/profile-pro-subscription.component';
import { ProComponent } from './pages/pro.component';
import { PRO_PATHS } from './pro-routing-constants';

const routes: Route[] = [
  {
    path: '',
    component: ProComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
    canDeactivate: [ExitConfirmGuard],
    canActivateChild: [NgxPermissionsGuard],
    data: {
      isMyZone: true,
      isProfile: true,
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: PRO_PATHS.SUBSCRIPTIONS },
      {
        path: PRO_PATHS.SUBSCRIPTIONS,
        component: SubscriptionsComponent,
        data: {
          isMyZone: true,
          isProfile: true,
          permissions: {
            except: PERMISSIONS.professional,
            redirectTo: {
              [PERMISSIONS.professional]: `${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS_PRO}`,
            },
          },
        },
      },
      {
        path: PRO_PATHS.BILLING,
        component: InvoiceComponent,
        canDeactivate: [ExitConfirmGuard],
        data: {
          isMyZone: true,
          isProfile: true,
        },
      },
      {
        path: PRO_PATHS.SUBSCRIPTIONS_PRO,
        component: ProfileProSubscriptionComponent,
        data: {
          isMyZone: true,
          isProfile: true,
          permissions: {
            only: PERMISSIONS.professional,
            redirectTo: `${PRO_PATHS.PRO_MANAGER}/${PRO_PATHS.SUBSCRIPTIONS}`,
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
export class ProRoutingModule {}

export const proRoutedComponents = [SubscriptionsComponent, ProfileProSubscriptionComponent, InvoiceComponent];
