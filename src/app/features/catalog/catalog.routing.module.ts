import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';

import { CatalogComponent } from './catalog.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { isEmpty } from 'lodash-es';
import { LoggedGuard } from '@core/user/logged.guard';
import { PERMISSIONS } from '@core/user/user';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ListComponent } from './pages/list/list.component';

export function isNormalCatalogPermissions(
  rejectedPermissionName: string,
  route: ActivatedRouteSnapshot
) {
  if (isEmpty(route.params)) {
    return '/pro/catalog/list';
  } else {
    return {
      navigationCommands: ['/pro/catalog/list', route.params],
    };
  }
}

export function isNormalCheckoutPermissions(
  rejectedPermissionName: string,
  route: ActivatedRouteSnapshot
) {
  if (!route.params.itemId) {
    return '/pro/catalog/checkout';
  }
  return {
    navigationCommands: [
      '/pro/catalog/checkout/',
      { itemId: route.params.itemId },
    ],
  };
}

export const routes: Routes = [
  {
    path: '',
    canActivate: [LoggedGuard],
    canActivateChild: [NgxPermissionsGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: ListComponent,
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            except: PERMISSIONS.professional,
            redirectTo: {
              isProfessional: isNormalCatalogPermissions,
            },
          },
        },
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            except: PERMISSIONS.professional,
            redirectTo: {
              isProfessional: isNormalCheckoutPermissions,
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
export class CatalogRoutingModule {}

export const catalogRoutedComponents = [
  CatalogComponent,
  ListComponent,
  CheckoutComponent,
];
