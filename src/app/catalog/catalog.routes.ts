import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { LoggedGuard } from '../core/user/logged.guard';
import { CatalogComponent } from './catalog.component';
import { TutorialGuard } from '../shared/guards/tutorial.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';
import * as _ from 'lodash';

export function isNormalCatalogPermissions() {
  return (rejectedPermissionName: string, route: ActivatedRouteSnapshot) => {
    if (!route.params.itemId) {
      return '/pro/catalog/checkout';
    }
    return {
      navigationCommands: ['/pro/catalog/checkout/', { itemId: route.params.itemId }]
    };
  };
}

export function isNormalCheckoutPermissions() {
  return (rejectedPermissionName: string, route: ActivatedRouteSnapshot) => {
    if (!route.params.itemId) {
      return '/pro/catalog/checkout';
    }
    return {
      navigationCommands: ['/pro/catalog/checkout/', { itemId: route.params.itemId }]
    };
  };
}

export const routes: Routes = [
  {
    path: '',
    canActivate: [LoggedGuard, TutorialGuard],
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
            only: PERMISSIONS.normal,
            redirectTo: {
              isNormal: isNormalCatalogPermissions
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
            only: PERMISSIONS.normal,
            redirectTo: {
              isNormal: isNormalCheckoutPermissions
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
