import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Route, RouterModule } from '@angular/router';

import { NgxPermissionsGuard } from 'ngx-permissions';
import { LoggedGuard } from '@core/user/logged.guard';
import { PERMISSIONS } from '@core/user/user-constants';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { BUMPS_PATHS } from './bumps-routing-constants';

export function isNormalCheckoutPermissions(rejectedPermissionName: string, route: ActivatedRouteSnapshot) {
  if (!route.params.itemId) {
    return '/pro/catalog/checkout';
  }
  return {
    navigationCommands: ['/pro/catalog/checkout/', { itemId: route.params.itemId }],
  };
}

export const routes: Route[] = [
  {
    path: '',
    canActivate: [LoggedGuard],
    canActivateChild: [NgxPermissionsGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: BUMPS_PATHS.CHECKOUT,
      },
      {
        path: BUMPS_PATHS.CHECKOUT,
        component: CheckoutComponent,
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            only: PERMISSIONS.bumps,
            except: PERMISSIONS.professional,
            redirectTo: {
              [PERMISSIONS.professional]: isNormalCheckoutPermissions,
              default: '',
            },
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
export class BumpsRoutingModule {}

export const bumpsRoutedComponents = [CheckoutComponent];
