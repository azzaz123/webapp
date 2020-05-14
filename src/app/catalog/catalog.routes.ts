import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { LoggedGuard } from '../core/user/logged.guard';
import { CatalogComponent } from './catalog.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';
import { isEmpty } from 'lodash-es';

export function isNormalCatalogPermissions(rejectedPermissionName: string, route: ActivatedRouteSnapshot) {
  if (isEmpty(route.params)) {
    return '/pro/catalog/list';
  } else {
    return {
      navigationCommands: ['/pro/catalog/list', route.params]
    };
  }
}

export function isNormalCheckoutPermissions(rejectedPermissionName: string, route: ActivatedRouteSnapshot) {
  if (!route.params.itemId) {
    return '/pro/catalog/checkout';
  }
  return {
    navigationCommands: ['/pro/catalog/checkout/', { itemId: route.params.itemId }]
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
        redirectTo: 'list'
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
              isNormal: isNormalCatalogPermissions,
              isFeatured: isNormalCheckoutPermissions
            }
          }
        }
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
              isNormal: isNormalCheckoutPermissions,
              isFeatured: isNormalCheckoutPermissions
            }
          }
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {
}

export const catalogRoutedComponents = [
  CatalogComponent,
  ListComponent,
  CheckoutComponent,
];
